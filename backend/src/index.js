import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import vencimientosRoutes from './routes/vencimientos.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import { initCronJob } from './cron/reminder.cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/vencimientos', vencimientosRoutes);
app.use('/notifications', notificationRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('API Vencimientos App funcionando ok');
});

// Start Cron
initCronJob();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
