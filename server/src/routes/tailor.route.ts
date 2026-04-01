import { Router } from 'express';
import { scrapeJob } from '../controllers/scrape.controller.js';
import {
	createTailorJob,
	downloadResumePDF,
	streamTailorResume,
} from '../controllers/tailor.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/tailor', authMiddleware, createTailorJob);
router.get('/tailor/stream/:id', authMiddleware, streamTailorResume);
router.get('/tailor/download/:id', authMiddleware, downloadResumePDF);
router.post('/scrape', authMiddleware, scrapeJob);

export default router;
