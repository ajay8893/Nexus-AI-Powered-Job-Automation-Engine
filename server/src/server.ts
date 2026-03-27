import { toNodeHandler } from 'better-auth/node';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { createAuth } from './lib/auth.js';
import { setAuthInstance } from './lib/authInstance.js';

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectDB();

		// Now that DB is connected, we can safely create the auth instance
		const auth = createAuth();
		setAuthInstance(auth);

		// Start the server
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.log('Error starting server', error);
	}
};

startServer();
