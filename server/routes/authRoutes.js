import express from 'express';
import {
    register,
    login,
    getCurrentUser,
    forgotPassword
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/forgot-password', forgotPassword);

export default router;

