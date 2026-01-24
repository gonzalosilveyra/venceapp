import prisma from '../prisma.js';
import webpush from 'web-push';

export const subscribe = async (req, res) => {
    try {
        const { subscription } = req.body;
        const userId = req.user.id;

        // subscription has endpoint, and keys (p256dh, auth)
        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                usuario_id: userId,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            },
            create: {
                usuario_id: userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            }
        });

        res.status(201).json({ message: 'Suscripción guardada' });
    } catch (error) {
        console.error('Error en suscripción push:', error);
        res.status(500).json({ error: 'Error al registrar suscripción' });
    }
};

export const sendPushNotification = async (userId, title, body) => {
    try {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { usuario_id: userId }
        });

        const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
        const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

        webpush.setVapidDetails(
            'mailto:venceapp.no.reply@gmail.com',
            publicVapidKey,
            privateVapidKey
        );

        const payload = JSON.stringify({ title, body });

        const promises = subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            return webpush.sendNotification(pushConfig, payload)
                .catch(err => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        // Suscripción inválida o expirada, eliminarla
                        return prisma.pushSubscription.delete({ where: { id: sub.id } });
                    }
                    console.error('Error enviando notificación push:', err);
                });
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Error general en push:', error);
    }
};
