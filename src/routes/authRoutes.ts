import express from 'express';
import { register, login, verifyToken } from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/verify', verifyToken);

export default router;