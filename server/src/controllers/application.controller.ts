import type { Request, Response } from 'express';
import JobApplication from '../models/application.model.js';
import mongoose from 'mongoose';

export const getApplications = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const applications = await JobApplication.find({ userId }).sort({
			updatedAt: -1,
		});

		return res.status(200).json(applications);
	} catch (error: any) {
		console.log('Error in getApplications:', error.message);
		res.status(500).json({ error: 'Failed to fetch applications' });
	}
};

export const createApplication = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;
		const {
			companyName,
			jobTitle,
			location,
			salary,
			jobUrl,
			description,
			status,
			tailoredDocumentId,
		} = req.body;

		if (!userId || !companyName || !jobTitle) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const application = await JobApplication.create({
			userId,
			companyName,
			jobTitle,
			location,
			salary,
			jobUrl,
			description,
			status: status || 'Draft',
			tailoredDocumentId,
			appliedAt: status === 'Applied' ? new Date() : undefined,
		});

		return res.status(201).json(application);
	} catch (error: any) {
		console.log('Error in createApplication:', error.message);
		res.status(500).json({ error: 'Failed to create application' });
	}
};

export const updateApplication = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;
		const { id } = req.params;
		const updates = req.body;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		// If status is changed to Applied, set appliedAt if not already set
		if (updates.status === 'Applied' && !updates.appliedAt) {
			updates.appliedAt = new Date();
		}

		const application = await JobApplication.findOneAndUpdate(
			{ _id: id, userId },
			updates,
			{ new: true },
		);

		if (!application) {
			return res.status(404).json({ error: 'Application not found' });
		}

		return res.status(200).json(application);
	} catch (error: any) {
		console.log('Error in updateApplication:', error.message);
		res.status(500).json({ error: 'Failed to update application' });
	}
};

export const deleteApplication = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;
		const { id } = req.params;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const application = await JobApplication.findOneAndDelete({
			_id: id,
			userId,
		});

		if (!application) {
			return res.status(404).json({ error: 'Application not found' });
		}

		return res.status(200).json({ message: 'Application deleted successfully' });
	} catch (error: any) {
		console.log('Error in deleteApplication:', error.message);
		res.status(500).json({ error: 'Failed to delete application' });
	}
};

export const getDashboardStats = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).user?.id;

		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const totalApplications = await JobApplication.countDocuments({ userId });
		const interviewCount = await JobApplication.countDocuments({
			userId,
			status: 'Interviewing',
		});
		
		const statusCounts = await JobApplication.aggregate([
			{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
			{ $group: { _id: '$status', count: { $sum: 1 } } },
		]);

		const recentApplications = await JobApplication.find({ userId })
			.sort({ createdAt: -1 })
			.limit(5);

        // Calculate application activity over time (grouped by day)
		const activityTimeline = await JobApplication.aggregate([
			{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					applications: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// Calculate interview rate safely
		const interviewRate = totalApplications > 0 
			? Math.round((interviewCount / totalApplications) * 100) 
			: 0;

		return res.status(200).json({
			totalApplications,
			interviewCount,
			interviewRate,
			statusCounts: statusCounts.reduce((acc, curr) => {
				acc[curr._id] = curr.count;
				return acc;
			}, {}),
			recentApplications,
            activityTimeline: activityTimeline.map(item => ({
                date: item._id,
                applications: item.applications
            })),
		});
	} catch (error: any) {
		console.log('Error in getDashboardStats:', error.message);
		res.status(500).json({ error: 'Failed to fetch dashboard stats' });
	}
};
