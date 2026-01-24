import { Router } from 'express';
import { getVencimientos, createVencimiento, updateVencimiento, deleteVencimiento } from '../controllers/vencimientos.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getVencimientos);
router.post('/', createVencimiento);
router.put('/:id', updateVencimiento);
router.delete('/:id', deleteVencimiento);

export default router;
