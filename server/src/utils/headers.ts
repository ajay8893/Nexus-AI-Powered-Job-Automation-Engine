import type { Request as ExpressRequest } from 'express';
export const toHeaders = (req: ExpressRequest) => {
	const headers = new Headers();

	Object.entries(req.headers).forEach(([key, value]) => {
		if (value) {
			headers.append(key, Array.isArray(value) ? value.join(',') : value);
		}
	});

	return headers;
};
