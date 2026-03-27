import { Router } from 'express';
import { deleteResume, getUserResumes, saveResume, setMasterResume } from '../controllers/resume.controller.js';

const router = Router();

router.post('/resume/upload', saveResume);
router.post('/resume/master', setMasterResume);
router.delete('/resume/:resumeId', deleteResume);
router.get('/resume/user/:userId', getUserResumes);

export default router;