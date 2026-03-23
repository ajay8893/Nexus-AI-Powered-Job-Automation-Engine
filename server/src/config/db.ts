import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
	// We pull the URI inside the function to ensure dotenv has finished loading
	const MONGODB_URI = process.env.MONGO_URI;

	if (!MONGODB_URI) {
		throw new Error('Please provide a MongoDB URI in your .env file');
	}

	try {
		const conn = await mongoose.connect(MONGODB_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error connecting to MongoDB: ${error}`);
		process.exit(1);
	}
};
