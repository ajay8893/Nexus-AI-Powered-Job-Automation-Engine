import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { getAuthInstance } from './lib/authInstance.js';
import applicationRouter from './routes/application.route.js';
import resumeRouter from './routes/resume.route.js';
import tailorRouter from './routes/tailor.route.js';

// Initialize express app
const app = express();

app.use(
	cors({
		origin: (origin, callback) => {
			// 1. Allow local dev and your explicit canonical production URL
			const explicitOrigins = ['http://localhost:3000', process.env.CLIENT_URL];

			if (!origin) {
				return callback(null, true);
			}

			// 2. Grant access if it's an exact match OR if it matches any Vercel preview subdomain
			const isExplicitMatch = explicitOrigins.includes(origin);
			const isVercelPreviewMatch = origin.endsWith('.vercel.app');

			if (isExplicitMatch || isVercelPreviewMatch) {
				callback(null, true);
			} else {
				callback(new Error('Blocked by Nexus Security Layer (CORS)'));
			}
		},
		credentials: true, // Vital for sharing authentication cookies cross-domain
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
