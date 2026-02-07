/**
 * Script de prueba para verificar el envío de emails
 * 
 * Uso:
 *   node test-email.js tu-email@ejemplo.com
 * 
 * Si no proporcionas un email, usará test@test.com por defecto
 */

import { sendWelcomeEmail } from './src/services/email.service.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = process.argv[2] || 'test@test.com';
const testName = process.argv[3] || 'Usuario de Prueba';

console.log('🧪 Iniciando prueba de envío de email...\n');
console.log(`📧 Destinatario: ${testEmail}`);
console.log(`👤 Nombre: ${testName}\n`);

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('⚠️  ADVERTENCIA: No se encontraron las credenciales de Gmail en el archivo .env');
    console.log('   El email se simulará pero no se enviará realmente.\n');
    console.log('   Para configurar Gmail, revisa el archivo CONFIGURACION_EMAIL.md\n');
}

console.log('📤 Enviando email de bienvenida...\n');

sendWelcomeEmail(testEmail, testName)
    .then(() => {
        console.log('\n✅ Proceso completado!');
        console.log('   Revisa los logs arriba para ver si el email se envió correctamente.');
        console.log('   Si está configurado Gmail, revisa tu bandeja de entrada (y spam).\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error al enviar el email:');
        console.error(error);
        process.exit(1);
    });
