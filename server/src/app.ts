import cors from 'cors';
import express, { type Request, type Response } from 'express';
import authRouter from './routes/auth.route.js';
import resumeRouter from './routes/resume.route.js';

// Initialize express app
const app = express();

// Global Middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);
app.use(express.json());

// Health Check Routes
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

// Auth Routes
app.use('/api/auth', authRouter);

// Resume Routes
app.use('/api', resumeRouter);

export default app;
