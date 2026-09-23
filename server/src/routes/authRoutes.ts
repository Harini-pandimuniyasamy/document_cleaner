import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected auth route
router.get('/me', protect, getCurrentUser);

export default router;
