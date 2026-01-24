import { Router } from 'express';
import { login, registro, updateProfile, updateAvatar } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';

// Config multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.put('/perfil', authenticateToken, updateProfile);
router.post('/avatar', authenticateToken, upload.single('avatar'), updateAvatar);

export default router;
