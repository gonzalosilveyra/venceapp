import { Router } from 'express';
import { subscribe } from '../controllers/notifications.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/subscribe', authenticateToken, subscribe);

export default router;
