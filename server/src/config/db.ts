import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
	// We pull the URI inside the function to ensure dotenv has finished loading
	const MONGODB_URI = process.env.MONGO_URI;

	// --- ADD THIS LOG FOR TRUTH ---
	console.log('--- DB CONNECTION ATTEMPT ---');
	console.log(
		'Attempting connection with string prefix:',
		MONGODB_URI?.substring(0, 30),
	);
	console.log('---------------------------------');

	if (!MONGODB_URI) {
		throw new Error('Please provide a MongoDB URI in your .env file');
	}

	try {
		const conn = await mongoose.connect(MONGODB_URI, {
			family: 4,
		});
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error connecting to MongoDB: ${error}`);
		process.exit(1);
	}
};
