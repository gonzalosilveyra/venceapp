# 📧 Configuración de Email para VenceApp

Este documento explica cómo configurar el envío de emails en VenceApp para las funcionalidades de:
- ✉️ Email de bienvenida al registrarse
- 🔔 Recordatorios automáticos de vencimientos

## 🔧 Configuración de Gmail

VenceApp utiliza Gmail para enviar emails. Para configurarlo, necesitas:

### 1. Crear una Contraseña de Aplicación de Google

Google requiere que uses una "App Password" (contraseña de aplicación) en lugar de tu contraseña normal cuando accedes a Gmail desde aplicaciones de terceros.

**Pasos:**

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú lateral, selecciona **Seguridad**
3. En "Cómo inicias sesión en Google", asegúrate de tener activada la **verificación en dos pasos** (es obligatorio para crear App Passwords)
4. Una vez activada la verificación en dos pasos, busca **Contraseñas de aplicaciones**: https://myaccount.google.com/apppasswords
5. Selecciona la aplicación: **Correo**
6. Selecciona el dispositivo: **Otro (nombre personalizado)** → escribe "VenceApp"
7. Haz clic en **Generar**
8. Google te mostrará una contraseña de 16 caracteres. **Cópiala** (no podrás verla de nuevo)

### 2. Configurar las Variables de Entorno

Abre el archivo `.env` en la carpeta `backend` y agrega:

```bash
GMAIL_USER="tu-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

**Ejemplo:**
```bash
GMAIL_USER="venceapp.notificaciones@gmail.com"
GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"
```

> ⚠️ **Importante:** La App Password tiene 16 caracteres con espacios. Puedes copiarla con o sin espacios, ambas formas funcionan.

### 3. Reiniciar el Servidor

Después de configurar las variables de entorno, reinicia el servidor backend:

```bash
npm run dev
```

## ✅ Verificar que Funciona

### Opción 1: Registrar un nuevo usuario

1. Ve al frontend de VenceApp
2. Registra un nuevo usuario con tu email personal
3. Revisa tu bandeja de entrada (y spam) para ver el email de bienvenida

### Opción 2: Revisar los logs

Si no tienes configuradas las credenciales de Gmail, el sistema **NO fallará**. En su lugar, simulará el envío y mostrará un log en la consola:

```
[EMAIL SIMULADO - FALTAN CREDENCIALES]
Para: usuario@ejemplo.com | Asunto: 🎉 ¡Bienvenido a VenceApp!
```

Si las credenciales están configuradas correctamente, verás:

```
✅ Email de bienvenida enviado a usuario@ejemplo.com
Email enviado a usuario@ejemplo.com (Message ID: <...>)
```

## 🎨 Personalización del Email

El template del email de bienvenida se encuentra en:
```
backend/src/services/email.service.js
```

En la función `sendWelcomeEmail()` puedes personalizar:
- El asunto del email
- El contenido HTML
- Los colores y estilos
- El enlace al dashboard

## 🔄 Recordatorios Automáticos

Los recordatorios de vencimientos también usan el mismo sistema de email. Se envían automáticamente:
- **7 días antes** del vencimiento
- **1 día antes** del vencimiento  
- **El día del vencimiento**

El cron job se ejecuta todos los días a las **8:00 AM** (configurable en `backend/src/cron/reminder.cron.js`).

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica que estés usando una **App Password**, no tu contraseña normal de Gmail
- Asegúrate de tener activada la verificación en dos pasos

### Error: "Less secure app access"
- Google ya no permite el acceso de "aplicaciones menos seguras"
- **Debes usar App Passwords obligatoriamente**

### Los emails no llegan
- Revisa la carpeta de **Spam**
- Verifica que el email en `GMAIL_USER` sea correcto
- Revisa los logs del servidor para ver si hay errores

### Emails en modo simulación
- Si ves `[EMAIL SIMULADO - FALTAN CREDENCIALES]` en los logs, significa que las variables `GMAIL_USER` o `GMAIL_APP_PASSWORD` no están configuradas
- Verifica que el archivo `.env` tenga ambas variables correctamente

## 📚 Recursos Adicionales

- [Contraseñas de aplicaciones de Google](https://support.google.com/accounts/answer/185833)
- [Nodemailer Gmail Documentation](https://nodemailer.com/usage/using-gmail/)
- [Verificación en dos pasos de Google](https://www.google.com/landing/2step/)

---

¿Necesitas ayuda? Revisa los logs del servidor o contacta al equipo de desarrollo.
