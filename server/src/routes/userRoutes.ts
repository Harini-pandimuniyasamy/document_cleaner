import { Router } from 'express';
import { getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// GET /api/users/me
router.get('/me', protect, getCurrentUser);

export default router;
