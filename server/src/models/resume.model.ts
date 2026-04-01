import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
	userId: mongoose.Types.ObjectId;
	fileName: string;
	fileUrl?: string;
	fileKey: string;
	isMaster: boolean;
	content?: Object;
}

const resumeSchema = new Schema<IResume>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		fileName: { type: String, required: true },
		fileUrl: { type: String }, // url from s3/cloudinary/uploadthing
    fileKey: { type: String, required: true }, // key from s3/cloudinary/uploadthing
		isMaster: { type: Boolean, default: false },
		content: { type: Schema.Types.Mixed }, // parsed JSON/TEXT from the uploaded resume
	},
	{ timestamps: true },
);

export const Resume =
	mongoose.models.Resume || mongoose.model<IResume>('Resume', resumeSchema);
