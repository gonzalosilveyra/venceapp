import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export const sendEmail = async (to, subject, html) => {
    // Si no están configuradas las credenciales, solo loguear
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.log(`[EMAIL SIMULADO - FALTAN CREDENCIALES]`);
        console.log(`Para: ${to} | Asunto: ${subject}`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"VenceApp" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email enviado a ${to} (Message ID: ${info.messageId})`);
    } catch (error) {
        console.error('Error enviando email vía Gmail:', error);
    }
};

/**
 * Envía un email de bienvenida a un nuevo usuario registrado
 * @param {string} email - Email del usuario
 * @param {string} nombre - Nombre del usuario (opcional)
 */
export const sendWelcomeEmail = async (email, nombre = '') => {
    const displayName = nombre || email.split('@')[0];

    const subject = '🎉 ¡Bienvenido a VenceApp!';

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; padding: 40px 0; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e1e8f0;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">VenceApp</h1>
                    <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Tu asistente de vencimientos</p>
                </div>
                
                <!-- Body -->
                <div style="padding: 40px 35px;">
                    <h2 style="margin-top: 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                        ¡Hola ${displayName}! 👋
                    </h2>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        ¡Bienvenido a <strong style="color: #4F46E5;">VenceApp</strong>! Nos alegra mucho que te hayas unido a nuestra comunidad.
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        Con VenceApp podrás:
                    </p>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <ul style="margin: 0; padding-left: 20px; color: #475569;">
                            <li style="margin-bottom: 12px;">
                                <strong style="color: #1e293b;">📅 Gestionar tus vencimientos</strong><br>
                                <span style="font-size: 14px; color: #64748b;">Organiza todos tus pagos, compromisos y fechas importantes en un solo lugar</span>
                            </li>
                            <li style="margin-bottom: 12px;">
                                <strong style="color: #1e293b;">🔔 Recibir recordatorios automáticos</strong><br>
                                <span style="font-size: 14px; color: #64748b;">Te notificaremos por email antes de cada vencimiento para que nunca olvides nada</span>
                            </li>
                            <li style="margin-bottom: 0;">
                                <strong style="color: #1e293b;">🔄 Configurar vencimientos recurrentes</strong><br>
                                <span style="font-size: 14px; color: #64748b;">Programa pagos mensuales o anuales y olvídate de ingresarlos manualmente</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4F46E5;">
                        <p style="margin: 0; color: #1e293b; font-size: 15px;">
                            <strong>💡 Consejo:</strong> Comienza agregando tus vencimientos más importantes. Te recomendamos activar las notificaciones para no perderte ningún recordatorio.
                        </p>
                    </div>
                    
                    <div style="margin-top: 35px; text-align: center;">
                        <a href="http://localhost:4200/dashboard" style="background-color: #4F46E5; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                            Comenzar ahora
                        </a>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 25px; text-align: center; font-size: 13px; color: #64748b;">
                    <p style="margin: 0;">
                        Gracias por confiar en <span style="font-weight: 600; color: #4F46E5;">VenceApp</span>
                    </p>
                    <p style="margin: 10px 0 0 0;">
                        Si no creaste esta cuenta, puedes ignorar este mensaje.
                    </p>
                    <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                        © ${new Date().getFullYear()} VenceApp. Todos los derechos reservados.
                    </p>
                </div>
                
            </div>
        </div>
    `;

    await sendEmail(email, subject, html);
};
