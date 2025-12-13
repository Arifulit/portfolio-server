import { Router } from 'express';
import { 
  login, 
  register, 
  logout, 
  getCurrentUser,
  getProfile,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/profile', authMiddleware, getProfile);

export default router;