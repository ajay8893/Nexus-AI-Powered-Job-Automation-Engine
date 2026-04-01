import type { Request, Response } from 'express';
import { Resume } from '../models/resume.model.js';
import tailoredDocumentModel from '../models/tailoredDocument.model.js';
import { aiResponse } from '../services/ai.service.js';
import { generateATSResumePDF } from '../services/pdf.service.js';
import { reparseResumeText } from './resume.controller.js';

export const createTailorJob = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;
		const { jobDescription, selectedKeywords } = req.body;

		if (!userId || !jobDescription) {
			return res.status(400).json({ error: 'Missing data' });
		}

		const masterResume = await Resume.findOne({
			userId,
			isMaster: true,
		});

		if (!masterResume) {
			return res.status(404).json({ error: 'Master resume not found' });
		}

		const doc = await tailoredDocumentModel.create({
			userId,
			originalResumeId: masterResume._id,
			jobTitle: 'Untitled Role',
			companyName: 'Unknown Company',
			jobDescription,
			selectedKeywords: selectedKeywords || [],
			status: 'processing',
		});

		return res.status(201).json({
			documentId: doc._id,
		});
	} catch (error: any) {
		console.log('Error in create Job:', error.message);
		res
			.status(500)
			.json({ error: 'Failed to create job', details: error.message });
	}
};

export const streamTailorResume = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const userId = (req as any).user?.id;

		const doc = await tailoredDocumentModel.findById(id);

		if (!doc) {
			return res.status(404).json({ error: 'Document not found' });
		}

		const masterResume = await Resume.findById(doc.originalResumeId);

		if (!masterResume) {
			return res.status(404).json({ error: 'Master resume not found' });
		}

		// --- FIX: Extract text from PDF if missing ---
		let resumeString = '';
		const resumeTextRaw = masterResume.content;

		if (!resumeTextRaw || (typeof resumeTextRaw === 'string' && resumeTextRaw.trim() === '')) {
			console.log('--- Warning: Master resume content is empty. Attempting re-parse... ---');
			if (masterResume.fileUrl) {
				resumeString = await reparseResumeText(masterResume.fileUrl);
				
				// Update the resume in DB so we don't have to re-parse next time
				if (resumeString) {
					await Resume.findByIdAndUpdate(masterResume._id, { content: resumeString });
					console.log('--- Resume content recovered and saved to DB ---');
				}
			}
		} else {
			resumeString =
				typeof resumeTextRaw === 'object' && resumeTextRaw !== null
					? JSON.stringify(resumeTextRaw)
					: (resumeTextRaw as string) || '';
		}

		// --- PLACE LOGS HERE ---
		console.log('--- DEBUG: TAILORING START ---');
		console.log('Target User ID:', userId);
		console.log('Resume Master Content Type:', typeof masterResume.content);
		console.log('Resume Master Content Value (snippet):', typeof masterResume.content === 'string' ? masterResume.content.substring(0, 50) : JSON.stringify(masterResume.content)?.substring(0, 50));
		console.log('Resume Content Found:', !!masterResume.content);
		console.log('Resume Text Length:', resumeString?.length || 0);
		console.log('Job Description Length:', doc.jobDescription?.length || 0);
		console.log('-------------------------------');

		await aiResponse({
			req,
			res,
			resumeText: resumeString || '',
			jobDescription: doc.jobDescription,
			documentId: doc._id,
			selectedKeywords: doc.selectedKeywords || [],
		});
	} catch (error: any) {
		console.log('Error in stream Job:', error.message);
		res.status(500).json({ error: 'Streaming failed', details: error.message });
	}
};

export const downloadResumePDF = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const doc = await tailoredDocumentModel.findById(id);

		if (!doc || !doc.tailoredContent) {
			return res.status(404).json({ error: 'Tailored content not found.' });
		}

		console.log('--- Generating ATS PDF for document:', id, '---');
		const pdfBuffer = await generateATSResumePDF(doc.tailoredContent);

		const filename = `${doc.jobTitle.replace(/\s+/g, '_')}_Resume.pdf`;

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		res.send(Buffer.from(pdfBuffer));
	} catch (error: any) {
		console.error('PDF Generation Error:', error.message);
		res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
	}
};
