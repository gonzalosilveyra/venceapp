# 🔙 VenceApp - Backend

Backend API para VenceApp, una aplicación de gestión de vencimientos y recordatorios.

## 🚀 Tecnologías

- **Node.js** con **Express.js**
- **PostgreSQL** con **Prisma ORM**
- **JWT** para autenticación
- **Nodemailer** para envío de emails
- **node-cron** para tareas programadas
- **bcryptjs** para encriptación de contraseñas

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## ⚙️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   
   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```bash
   DATABASE_URL="postgresql://usuario:password@localhost:5432/vencimientos_app?schema=public"
   JWT_SECRET="tu-secreto-super-seguro"
   PORT=3000
   
   # Opcional: Para envío de emails
   GMAIL_USER="tu-email@gmail.com"
   GMAIL_APP_PASSWORD="tu-app-password"
   ```

3. **Crear la base de datos:**
   ```bash
   # Conectarse a PostgreSQL
   psql -U postgres
   
   # Crear la base de datos
   CREATE DATABASE vencimientos_app;
   ```

4. **Ejecutar migraciones de Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **Generar el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

6. **Crear usuario de prueba (opcional):**
   ```bash
   node seed-user.js
   ```
   
   Esto creará un usuario con:
   - Email: `test@test.com`
   - Password: `password123`

## 🏃 Ejecutar el Servidor

### Modo desarrollo (con hot-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints de la API

### Autenticación

#### `POST /auth/register`
Registra un nuevo usuario y envía un email de bienvenida.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

**Response:**
```json
{
  "token": "jwt-token...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

#### `POST /auth/login`
Inicia sesión con un usuario existente.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "token": "jwt-token...",
  "user": { ... }
}
```

### Vencimientos

> 🔒 Todos los endpoints de vencimientos requieren autenticación (header `Authorization: Bearer <token>`)

#### `GET /vencimientos`
Obtiene todos los vencimientos del usuario autenticado.

**Response:**
```json
[
  {
    "id": 1,
    "titulo": "Pago de luz",
    "fecha_vencimiento": "2024-02-15T00:00:00.000Z",
    "monto": 1500.50,
    "frecuencia": "MENSUAL",
    "activo": true
  }
]
```

#### `POST /vencimientos`
Crea un nuevo vencimiento.

**Body:**
```json
{
  "titulo": "Pago de luz",
  "fecha_vencimiento": "2024-02-15",
  "monto": 1500.50,
  "frecuencia": "MENSUAL",
  "descripcion": "Servicio de electricidad"
}
```

#### `PUT /vencimientos/:id`
Actualiza un vencimiento existente.

#### `DELETE /vencimientos/:id`
Elimina un vencimiento.

## 📧 Configuración de Emails

VenceApp envía emails automáticos para:
- ✉️ Bienvenida al registrarse
- 🔔 Recordatorios de vencimientos (7 días antes, 1 día antes, el día del vencimiento)

Para configurar el envío de emails con Gmail, consulta la guía completa:

📖 **[CONFIGURACION_EMAIL.md](./CONFIGURACION_EMAIL.md)**

### Probar el envío de emails:

```bash
node test-email.js tu-email@ejemplo.com "Tu Nombre"
```

## ⏰ Tareas Programadas (Cron Jobs)

El sistema ejecuta automáticamente un cron job **todos los días a las 8:00 AM** para:
- Verificar vencimientos próximos
- Enviar recordatorios por email
- Actualizar vencimientos recurrentes

Puedes modificar el horario en `src/cron/reminder.cron.js`.

## 🗄️ Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── controllers/           # Controladores de rutas
│   │   ├── auth.controller.js
│   │   └── vencimientos.controller.js
│   ├── services/              # Servicios (email, etc.)
│   │   └── email.service.js
│   ├── middleware/            # Middlewares (auth, etc.)
│   │   └── auth.middleware.js
│   ├── routes/                # Definición de rutas
│   │   ├── auth.routes.js
│   │   └── vencimientos.routes.js
│   ├── cron/                  # Tareas programadas
│   │   └── reminder.cron.js
│   ├── prisma.js              # Cliente de Prisma
│   └── index.js               # Punto de entrada
├── .env                       # Variables de entorno (no versionado)
├── .env.example               # Ejemplo de variables de entorno
├── seed-user.js               # Script para crear usuario de prueba
├── test-email.js              # Script para probar envío de emails
└── package.json
```

## 🔐 Seguridad

- Las contraseñas se encriptan con **bcrypt** antes de guardarse
- La autenticación usa **JWT** con expiración de 7 días
- Los endpoints de vencimientos están protegidos con middleware de autenticación
- Las variables sensibles se almacenan en `.env` (no versionado)

## 🧪 Testing

Para probar la API puedes usar:
- **Postman** o **Insomnia**
- **Thunder Client** (extensión de VS Code)
- **curl** desde la terminal

Ejemplo con curl:
```bash
# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Obtener vencimientos (reemplaza TOKEN con el token recibido)
curl http://localhost:3000/vencimientos \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica las credenciales en el `DATABASE_URL` del `.env`
- Asegúrate de que la base de datos `vencimientos_app` exista

### Error "Prisma Client not generated"
```bash
npx prisma generate
```

### Los emails no se envían
- Revisa la configuración de Gmail en el archivo `.env`
- Consulta la guía: [CONFIGURACION_EMAIL.md](./CONFIGURACION_EMAIL.md)
- Ejecuta el script de prueba: `node test-email.js`

### El servidor no inicia
- Verifica que el puerto 3000 no esté en uso
- Revisa los logs para ver el error específico
- Asegúrate de tener todas las dependencias instaladas: `npm install`

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/)
- [Nodemailer Docs](https://nodemailer.com/)

## 📝 Licencia

Este proyecto es privado y está en desarrollo.

---

Desarrollado con ❤️ para VenceApp
