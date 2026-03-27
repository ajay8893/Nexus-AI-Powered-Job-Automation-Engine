import type { createAuth } from './auth.js';

let authInstance: ReturnType<typeof createAuth>;

export const setAuthInstance = (auth: ReturnType<typeof createAuth>) => {
	authInstance = auth;
};

export const getAuthInstance = () => {
	if (!authInstance) {
		throw new Error('Auth instance not initialized');
	}
	return authInstance;
};
