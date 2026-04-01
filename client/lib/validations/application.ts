import { z } from 'zod';

export const jobApplicationSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	jobTitle: z.string().min(1, 'Job title is required'),
	location: z.string().optional(),
	salary: z.string().optional(),
	jobUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
	description: z.string().optional(),
	status: z.enum(['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected']),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
