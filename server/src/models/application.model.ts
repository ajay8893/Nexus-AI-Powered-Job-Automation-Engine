import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
	userId: mongoose.Types.ObjectId;
	companyName: string;
	jobTitle: string;
	location?: string;
	salary?: string;
	jobUrl?: string;
	description?: string;
	status: 'Draft' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
	appliedAt?: Date;
}

const jobApplicationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		companyName: { type: String, required: true },
		jobTitle: { type: String, required: true },
		location: { type: String },
		salary: { type: String },
		jobUrl: { type: String },
		description: { type: String },
		status: {
			type: String,
			enum: ['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected'],
			default: 'Draft',
		},
		appliedAt: { type: Date },
	},
	{ timestamps: true },
);

export default mongoose.models.JobApplication ||
	mongoose.model<IApplication>('JobApplication', jobApplicationSchema);
