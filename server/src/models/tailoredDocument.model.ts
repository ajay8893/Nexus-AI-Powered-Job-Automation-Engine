import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITailoredDocument extends Document {
	userId: Types.ObjectId;
	jobId: Types.ObjectId;
	originalResumeId: Types.ObjectId;
	tailoredContent: string;
	matchScore: number;
	keywordsDetected: string[];
	aiSuggestions: string[];
	status: 'draft' | 'completed' | 'downloaded';
}

const TailoredDocumentSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		jobId: {
			type: Schema.Types.ObjectId,
			ref: 'JobApplication',
			required: true,
		},
		originalResumeId: {
			type: Schema.Types.ObjectId,
			ref: 'Resume',
			required: true,
		},
		tailoredContent: { type: String, required: true },
		matchScore: { type: Number, required: true },
		keywordsDetected: { type: [String], required: true },
		aiSuggestions: { type: [String], required: true },
		status: {
			type: String,
			enum: ['draft', 'completed', 'downloaded'],
			default: 'completed',
		},
	},
	{ timestamps: true },
);

export default mongoose.models.TailoredDocument ||
	mongoose.model<ITailoredDocument>('TailoredDocument', TailoredDocumentSchema);
