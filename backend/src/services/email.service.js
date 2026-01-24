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
