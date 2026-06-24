import { Router } from 'express';
import { generateInterview } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// The user must pass the 'protect' Bouncer to reach the Controller!
router.post('/generate', protect, generateInterview);

export default router;
