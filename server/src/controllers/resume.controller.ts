import axios from 'axios';
import type { Request, Response } from 'express';
import { PDFParse } from 'pdf-parse';
import { UTApi } from 'uploadthing/server';
import { Resume } from '../models/resume.model.js';

const utapi = new UTApi();

interface SetMasterBody {
	resumeId: string;
	userId: string;
}

interface SaveResumeBody {
	userId: string;
	fileName: string;
	fileUrl: string;
	fileKey: string;
}

export const reparseResumeText = async (fileUrl: string) => {
	try {
		console.log('--- Attempting PDF Parsing from URL ---', fileUrl);
		const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
		const buffer = Buffer.from(response.data);

		const parser = new PDFParse({ data: buffer });
		const parsedData = await parser.getText();
		const text = parsedData.text || '';
		
		await parser.destroy();
		
		console.log('--- Parsing Complete --- length:', text.length);
		return text;
	} catch (error: any) {
		console.error('--- Parsing Failed ---', error.message);
		return '';
	}
};

export const setMasterResume = async (
	req: Request<{}, {}, SetMasterBody>,
	res: Response,
) => {
	const { resumeId, userId } = req.body;

	if (!resumeId || !userId) {
		return res
			.status(400)
			.json({ error: 'Resume ID and User ID are required' });
	}

	try {
		const resume = await Resume.findOne({ _id: resumeId, userId });

		if (!resume) {
			return res.status(404).json({ error: 'Resume not found' });
		}

		await Resume.updateMany({ userId }, { isMaster: false });

		const updated = await Resume.findByIdAndUpdate(
			resumeId,
			{ isMaster: true },
			{ returnDocument: 'after' },
		);

		return res.status(200).json({ success: true, resume: updated });
	} catch (error) {
		return res.status(500).json({ error: 'Failed to set master resume' });
	}
};

export const saveResume = async (
	req: Request<{}, {}, SaveResumeBody>,
	res: Response,
) => {
	const { userId, fileName, fileUrl, fileKey } = req.body;

	if (!userId || !fileName || !fileUrl || !fileKey) {
		return res.status(400).json({
			error: 'User ID, File Name, File URL and File Key are required',
		});
	}

	try {
		// PDF Parsing
		const extractedText = await reparseResumeText(fileUrl);

		if (!extractedText) {
			console.warn('Warning: Resume extracted text is empty for URL:', fileUrl);
		}

		// Check if user has any existing resumes — auto-set first one as master
		const existingCount = await Resume.countDocuments({ userId });
		const shouldBeMaster = existingCount === 0;

		// Create the document with the 'content' field populated
		const newResume = await Resume.create({
			userId,
			fileName,
			fileUrl,
			fileKey,
			content: extractedText,
			isMaster: shouldBeMaster,
		});

		return res
			.status(201)
			.json({ message: 'Resume saved successfully', resume: newResume });
	} catch (error: any) {
		console.error('Error in saveResume:', error.message);
		return res.status(500).json({ error: 'Failed to save resume', details: error.message });
	}
};

export const getUserResumes = async (req: Request, res: Response) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({ error: 'User ID is required' });
	}

	try {
		const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

		res.status(200).json({ success: true, resumes });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch resumes' });
	}
};

export const deleteResume = async (req: Request, res: Response) => {
	const { resumeId } = req.params;

	if (!resumeId) {
		return res.status(400).json({ error: 'Resume ID is required' });
	}

	try {
		const resume = await Resume.findById(resumeId);

		if (!resume) {
			return res.status(404).json({ error: 'Resume not found' });
		}

		const wasMaster = resume.isMaster;
		const userId = resume.userId;

		// Delete from uploadthing
		if (resume.fileKey) {
			await utapi.deleteFiles(resume.fileKey);
		}

		await Resume.findByIdAndDelete(resumeId);

		// If the deleted resume was master, auto-promote the most recent remaining resume
		if (wasMaster) {
			const nextResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
			if (nextResume) {
				nextResume.isMaster = true;
				await nextResume.save();
				console.log(`✅ Auto-promoted "${nextResume.fileName}" to master after deletion`);
			}
		}

		res
			.status(200)
			.json({ success: true, message: 'Resume deleted successfully' });
	} catch (error) {
		console.error('❌ DELETE ERROR:', error);
		res.status(500).json({ error: 'Failed to delete resume' });
	}
};
