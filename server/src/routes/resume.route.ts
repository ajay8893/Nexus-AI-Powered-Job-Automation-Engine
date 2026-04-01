import { Router } from 'express';
import { deleteResume, getUserResumes, saveResume, setMasterResume } from '../controllers/resume.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/resume/upload', saveResume);
router.post('/resume/master', authMiddleware, setMasterResume);
router.delete('/resume/:resumeId', authMiddleware, deleteResume);
router.get('/resume/user/:userId', authMiddleware, getUserResumes);

export default router;