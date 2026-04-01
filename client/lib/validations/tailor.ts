import { z } from 'zod';

export const tailorSchema = z.object({
	jobUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
	jobDescription: z.string().min(50, 'Job description must be at least 50 characters').or(z.literal('')).optional(),
	companyName: z.string().optional(),
	jobTitle: z.string().optional(),
}).refine((data) => data.jobUrl || data.jobDescription, {
	message: "Either a Job URL or a Job Description must be provided.",
	path: ["jobDescription"],
});

export type TailorInput = z.infer<typeof tailorSchema>;
