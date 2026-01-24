# Sistema de Gestión de Vencimientos

Aplicación web para registrar y recibir recordatorios de vencimientos importantes.

## Tecnologías

- **Frontend**: Angular + Tailwind CSS
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Automatización**: Node-cron para emails diarios

## Instrucciones de Instalación

### 1. Base de Datos
Asegúrate de tener PostgreSQL corriendo y crea una base de datos llamada `vencimientos_app`.

### 2. Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia `.env.example` a `.env`
   - Edita `.env` con tus credenciales de base de datos y API Key de Resend (para emails).
4. Sincroniza la base de datos:
   ```bash
   npx prisma db push
   ```
   (O usa `npx prisma migrate dev` si prefieres migraciones).
5. Inicia el servidor:
   ```bash
   npm run dev
   ```

### 3. Frontend

1. Navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```
4. Abre tu navegador en `http://localhost:4200`.

## Automatización de Emails

El sistema ejecuta un cron job todos los días a las 8:00 AM para verificar vencimientos y enviar correos.
Para probarlo, puedes modificar `src/cron/reminder.cron.js` y cambiar el horario.
