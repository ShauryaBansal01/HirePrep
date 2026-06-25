import { Router } from 'express';
import { generateInterview, getInterview, submitInterview, getInterviewHistory } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate', protect, generateInterview);
router.get('/history', protect, getInterviewHistory); // MUST be before /:id
router.get('/:id', protect, getInterview);
router.post('/:id/submit', protect, submitInterview);

export default router;
