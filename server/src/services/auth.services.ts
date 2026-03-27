import type { Request as ExpressRequest } from 'express';
import { getAuthInstance } from '../lib/authInstance.js';
import { toHeaders } from '../utils/headers.js';

export const getSessionService = async (req: ExpressRequest) => {
	const auth = getAuthInstance();
	return await auth.api.getSession({
		headers: toHeaders(req),
	});
};
