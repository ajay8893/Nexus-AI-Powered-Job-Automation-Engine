import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { getAuthInstance } from './lib/authInstance.js';
import applicationRouter from './routes/application.route.js';
import resumeRouter from './routes/resume.route.js';
import tailorRouter from './routes/tailor.route.js';

// Initialize express app
const app = express();

const allowedOrigins = [
	'http://localhost:3000', // Local development
	process.env.CLIENT_URL, // Production Vercel URL
].filter(Boolean) as string[];

// Global Middleware
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps, curl, or server-to-server)
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
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
