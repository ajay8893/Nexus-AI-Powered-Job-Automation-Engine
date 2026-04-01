import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';

export const createAuth = () => {
	if (!mongoose.connection.db) {
		throw new Error('MongoDB not connected yet');
	}

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

		baseURL: 'http://localhost:5001',

		emailAndPassword: {
			enabled: true,
		},

		cookies: {
			sameSite: 'lax',
			secure: false,
		},
		trustedOrigins: ['http://localhost:3000', 'http://localhost:5001'],
	});
};
