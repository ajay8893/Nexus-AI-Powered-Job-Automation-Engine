import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';
import {
	signInController,
	signUpController,
} from '../controllers/auth.controller.js';
import { getAuthInstance } from '../lib/authInstance.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/sign-up', signUpController);
authRouter.post('/sign-in', signInController);

authRouter.get('/me', authMiddleware, (req, res) => {
	res.json({
		message: 'User fetched successfully',
		user: req.user,
	});
});

authRouter.all('{*path}', (req, res) => {
	const auth = getAuthInstance();
	return toNodeHandler(auth)(req, res);
});

export default authRouter;
