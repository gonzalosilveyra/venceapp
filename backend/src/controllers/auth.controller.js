import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registro = async (req, res) => {
    try {
        const { email, password, nombre, apellido } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const existingUser = await prisma.usuario.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.usuario.create({
            data: {
                email,
                password_hash: hashedPassword,
                nombre,
                apellido
            }
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                avatar: user.avatar,
                theme: user.theme
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al registrar' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                avatar: user.avatar,
                theme: user.theme
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { email, nombre, apellido, theme } = req.body;
        const userId = req.user.id; // From middleware

        // Validate unique email if changed
        if (email) {
            const existing = await prisma.usuario.findFirst({
                where: {
                    email,
                    NOT: { id: userId }
                }
            });
            if (existing) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
        }

        const user = await prisma.usuario.update({
            where: { id: userId },
            data: {
                email,
                nombre,
                apellido,
                theme
            }
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                avatar: user.avatar,
                theme: user.theme
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error actualizando perfil' });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        const userId = req.user.id;
        // In a real app we would upload to S3/Cloudinary. 
        // Here we just save the local path relative to the server
        const avatarUrl = `/uploads/${req.file.filename}`;

        const user = await prisma.usuario.update({
            where: { id: userId },
            data: { avatar: avatarUrl }
        });

        res.json({ avatar: avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error subiendo avatar' });
    }
};
