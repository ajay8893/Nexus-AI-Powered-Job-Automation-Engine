import { Router } from 'express';
import {
	getApplications,
	createApplication,
	updateApplication,
	deleteApplication,
	getDashboardStats,
} from '../controllers/application.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/applications/stats', authMiddleware, getDashboardStats);
router.get('/applications', authMiddleware, getApplications);
router.post('/applications', authMiddleware, createApplication);
router.patch('/applications/:id', authMiddleware, updateApplication);
router.delete('/applications/:id', authMiddleware, deleteApplication);

export default router;
