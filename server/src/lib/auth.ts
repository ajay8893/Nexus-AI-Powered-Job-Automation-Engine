import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';

export const createAuth = () => {
	if (!mongoose.connection.db) {
		throw new Error('MongoDB not connected yet');
	}

	const isProduction =
		process.env.NODE_ENV === 'production' || !!process.env.CLIENT_URL;

	return betterAuth({
		database: mongodbAdapter(mongoose.connection.db!, {
			client: mongoose.connection.getClient(),
		}),

		// Define your custom user schema
		user: {
			additionalFields: {
				onboardingCompleted: {
					type: 'boolean',
					defaultValue: false,
				},
				resumeUrl: {
					type: 'string',
					required: false,
				},

				masterResume: {
					type: 'string', //// You can store stringified JSON here
					required: false,
				},
			},
		},

		secret: process.env.BETTER_AUTH_SECRET,

		// baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5001',

		// 💡 FIX: Replace the single string with a dynamic allowlist object
		baseURL: {
			allowedHosts: [
				'localhost:3000',
				'localhost:5001',
				'nexus-ai-powered-job-automation-eng.vercel.app', // Your primary domain
				'*.vercel.app', // Whitelists all Vercel previews!
			],
			fallback: process.env.BETTER_AUTH_URL || 'http://localhost:5001',
		},

		emailAndPassword: {
			enabled: true,
		},

		cookies: {
			sameSite: isProduction ? 'none' : 'lax',
			secure: isProduction,
		},

		// Better Auth automatically maps allowedHosts into trustedOrigins,
		// but we add the client origin fallback for global CORS coverage.
		trustedOrigins: [
			'http://localhost:3000',
			'http://localhost:5001',
			'https://*.vercel.app', // Allows requests from any Vercel domain variant
		],
	});
};
