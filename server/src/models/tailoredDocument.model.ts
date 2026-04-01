import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITailoredDocument extends Document {
	userId: Types.ObjectId;
	jobId?: Types.ObjectId;
	originalResumeId: Types.ObjectId;

	jobTitle: string;
	companyName: string;
	jobDescription: string;
	jobUrl?: string;

	tailoredContent: string;

	matchScore?: number;
	keywordsDetected?: string[];
	aiSuggestions?: string[];
	selectedKeywords?: string[];
	status: 'processing' | 'completed' | 'failed' | 'downloaded';
}

const TailoredDocumentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		jobId: {
			type: Schema.Types.ObjectId,
			ref: 'JobApplication',
		},
		originalResumeId: {
			type: Schema.Types.ObjectId,
			ref: 'Resume',
			required: true,
		},
		
		// Job Details
		jobTitle: { type: String, required: true },
		companyName: { type: String, required: true },
		jobDescription: { type: String, required: true },
		jobUrl: { type: String },

		// AI Output
		tailoredContent: { type: String },

		// AI Analysis
		matchScore: { type: Number },
		keywordsDetected: { type: [String] },
		aiSuggestions: { type: [String] },
		selectedKeywords: { type: [String] },

		// Status
		status: {
			type: String,
			enum: ['processing', 'completed', 'failed', 'downloaded'],
			default: 'processing',
		},
	},
	{ timestamps: true },
);

TailoredDocumentSchema.index({ userId: 1 });
TailoredDocumentSchema.index({ jobTitle: 'text', companyName: 'text' });

export default mongoose.models.TailoredDocument ||
	mongoose.model<ITailoredDocument>('TailoredDocument', TailoredDocumentSchema);
