import type {
	Request as ExpressRequest,
	NextFunction,
	Response,
} from 'express';
import { getSessionService } from '../services/auth.services.js';

export const authMiddleware = async (
	req: ExpressRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await getSessionService(req);

		if (!session || !session?.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		(req as any).user = session.user;
		next();
	} catch (error) {
		next(error);
	}
};
