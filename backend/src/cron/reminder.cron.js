import cron from 'node-cron';
import prisma from '../prisma.js';
import { sendEmail } from '../services/email.service.js';
import { sendPushNotification } from '../controllers/notifications.controller.js';

export const initCronJob = () => {
    // Ejecutar cada día a las 8:00 AM
    cron.schedule('0 7 * * *', async () => {
        console.log('Ejecutando cron de recordatorios...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const vencimientos = await prisma.vencimiento.findMany({
            where: { activo: true },
            include: { usuario: true }
        });

        for (const v of vencimientos) {
            // Extraemos solo la fecha para evitar desfases UTC
            const dateOnly = v.fecha_vencimiento.toISOString().split('T')[0];
            const [year, month, day] = dateOnly.split('-').map(Number);
            const dueDate = new Date(year, month - 1, day);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            let shouldNotify = false;
            let message = '';
            let subject = '';

            // Verificar si ya se notificó hoy
            if (v.ultima_notificacion) {
                const last = new Date(v.ultima_notificacion);
                last.setHours(0, 0, 0, 0);
                if (last.getTime() === today.getTime()) {
                    continue; // Ya notificado hoy
                }
            }

            const template = (title, body) => `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; padding: 40px 0; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e1e8f0;">
                        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">VenceApp</h1>
                        </div>
                        <div style="padding: 40px 35px;">
                            <h2 style="margin-top: 0; color: #1e293b; font-size: 22px; font-weight: 600;">${title}</h2>
                            ${body}
                            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #edf2f7; text-align: center;">
                                <a href="http://localhost:4200" style="background-color: #4F46E5; color: #ffffff; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Ver mis vencimientos</a>
                            </div>
                        </div>
                        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #64748b;">
                            <p style="margin: 0;">Este es un recordatorio automático de <span style="font-weight: 600; color: #4F46E5;">VenceApp</span>.</p>
                            <p style="margin: 5px 0 0 0;">Si tienes dudas, contáctanos en venceapp.no.reply@gmail.com</p>
                        </div>
                    </div>
                </div>
            `;

            if (diffDays === 7) {
                shouldNotify = true;
                subject = `🔔 Falta 1 semana: ${v.titulo}`;
                message = template(
                    'Recordatorio de Vencimiento',
                    `<p>Hola,</p><p>Te informamos que tu compromiso <strong>${v.titulo}</strong> vence en <strong>7 días</strong>.</p>
                     <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong style="color: #475569;">Detalles:</strong><br>
                        📅 Fecha: ${dueDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>`
                );
            } else if (diffDays === 1) {
                shouldNotify = true;
                subject = `⚠️ Mañana vence: ${v.titulo}`;
                message = template(
                    '¡Es mañana!',
                    `<p>Hola,</p><p>Te recordamos que tu vencimiento <strong>${v.titulo}</strong> es el día de <strong>MAÑANA</strong>.</p>
                     <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                        <span style="color: #9a3412;">Asegúrate de realizar el pago o gestión necesaria para evitar recargos.</span>
                     </div>`
                );
            } else if (diffDays === 0) {
                shouldNotify = true;
                subject = `🚨 VENCE HOY: ${v.titulo}`;
                message = template(
                    '¡Hoy es el día!',
                    `<p>Hola,</p><p>Hoy vence el plazo para: <strong style="color: #ef4444; font-size: 20px;">${v.titulo}</strong>.</p>
                     <p>No olvides completar esta tarea antes de que termine el día.</p>`
                );
            }

            if (shouldNotify) {
                console.log(`Enviando notificación para ${v.titulo} a ${v.usuario.email}`);

                // Enviar email
                await sendEmail(v.usuario.email, subject, message);

                // Enviar notificación push
                const pushTitle = subject.replace(/🔔|⚠️|🚨/g, '').trim();
                const pushBody = `${v.titulo} - ${dueDate.toLocaleDateString('es-ES')}`;
                await sendPushNotification(v.usuario_id, pushTitle, pushBody);

                let updateData = {
                    ultima_notificacion: new Date()
                };

                // Si vence hoy y es recurrente, actualizamos la fecha para el próximo periodo
                if (diffDays === 0) {
                    let nextDate = new Date(dueDate);
                    if (v.frecuencia === 'MENSUAL') {
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        updateData.fecha_vencimiento = nextDate;
                    } else if (v.frecuencia === 'ANUAL') {
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        updateData.fecha_vencimiento = nextDate;
                    }
                }

                await prisma.vencimiento.update({
                    where: { id: v.id },
                    data: updateData
                });
            }
        }
    });
};
