import cors from 'cors';
import express, { type Request, type Response } from 'express';
import resumeRouter from './routes/resume.route.js';
import tailorRouter from './routes/tailor.route.js';
import applicationRouter from './routes/application.route.js';
import { getAuthInstance } from './lib/authInstance.js';
import { toNodeHandler } from 'better-auth/node';

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


app.use('/api/auth', (req, res) => {
	const auth = getAuthInstance();
	return toNodeHandler(auth)(req, res);
});

// Resume Routes
app.use('/api', resumeRouter);

// Tailor Routes
app.use('/api', tailorRouter);

// Application Routes
app.use('/api', applicationRouter);

export default app;
