import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Routes
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

// Auth Routes


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
