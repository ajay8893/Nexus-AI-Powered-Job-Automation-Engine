import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password?: string;
	image?: string;
	onboardingCompleted: boolean;
	resumeUrl?: string;
	masterResume?: {
		url: string; // S3 / Cloudinary
		fileName: string;
		uploadedAt: Date;
	}
}

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true }, // Should be hashed!
		image: { type: String },
		onboardingCompleted: { type: Boolean, default: false },
		resumeUrl: { type: String },
		masterResume: {
			url: { type: String },
			fileName: { type: String },
			uploadedAt: { type: Date, default: Date.now },
		},
	},
	{ timestamps: true },
);

// Explicitly naming the collection 'user' to match Better Auth
export default mongoose.models.User ||
	mongoose.model<IUser>('User', UserSchema, 'user');
