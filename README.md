# 🧵 Tienda de Tejidos - Setup Completo

Una tienda online de tejidos y materiales de costura, con panel administrativo y carrito de compras.

## 📋 Requisitos previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **MySQL** (v5.7 o superior)
- **Git**

## 🚀 Instalación rápida

### 1️⃣ Clonar/Descargar el proyecto

```bash
cd tienda-tejidos
```

### 2️⃣ Configurar Base de Datos

**Opción A: Usando MySQL CLI**
```bash
mysql -u root -p < database.sql
```

**Opción B: Manual**
1. Abre MySQL Workbench o línea de comandos
2. Copia y pega el contenido de `database.sql`
3. Ejecuta

### 3️⃣ Configurar Backend

```bash
cd server

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de MySQL
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# Instalar dependencias
npm install

# Iniciar servidor (desarrollo)
npm run dev
# El servidor correrá en http://localhost:5000
```

### 4️⃣ Configurar Frontend

```bash
cd ../client

# Copiar variables de entorno
cp .env.example .env.local

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
# La app correrá en http://localhost:5173
```

## 📁 Estructura del Proyecto

```
tienda-tejidos/
├── server/              # Backend Express + MySQL
│   ├── src/
│   │   ├── config/     # Configuración DB, auth, etc
│   │   ├── routes/     # Rutas API
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── models/     # Modelos de datos
│   │   ├── middleware/ # Middlewares
│   │   └── utils/      # Utilidades
│   ├── server.js       # Punto de entrada
│   ├── .env.example
│   └── package.json
│
├── client/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas
│   │   ├── services/   # Llamadas API
│   │   ├── hooks/      # Custom hooks
│   │   ├── styles/     # CSS global
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── database.sql         # Script SQL inicial
└── README.md           # Este archivo
```

## 🔑 Credenciales de prueba

Después de ejecutar `database.sql`, tendrás:

**Admin:**
- Email: `admin@tejidos.com`
- Contraseña: `123456` (la contraseña original es "123456" hasheada)

**Cliente:**
- Email: `cliente@ejemplo.com`
- Contraseña: `123456`

## 📡 Rutas API disponibles

### Autenticación
```
POST   /api/auth/register           Registrar usuario
POST   /api/auth/login              Iniciar sesión
POST   /api/auth/logout             Cerrar sesión
```

### Productos
```
GET    /api/products                Listar todos los productos
GET    /api/products/:id            Ver detalle de producto
POST   /api/products                Crear producto (solo admin)
PUT    /api/products/:id            Editar producto (solo admin)
DELETE /api/products/:id            Eliminar producto (solo admin)
```

### Pedidos
```
POST   /api/orders                  Crear nuevo pedido
GET    /api/orders                  Ver mis pedidos
GET    /api/orders/:id              Ver detalle de pedido
PUT    /api/orders/:id              Actualizar estado (solo admin)
```

### Usuarios
```
GET    /api/users/profile           Ver mi perfil
PUT    /api/users/profile           Actualizar perfil
```

## 🎨 Diseño

La interfaz está optimizada para una tienda de tejidos con:
- Paleta de colores cálida y acogedora
- Tema "cute" adaptado a textiles
- Diseño responsive (móvil y desktop)
- Animaciones suaves

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- MySQL 2
- JWT para autenticación
- Bcryptjs para hash de contraseñas

**Frontend:**
- React 18
- Vite (bundler rápido)
- React Router (navegación)
- Axios (cliente HTTP)
- Zustand (state management)

## 📝 Variables de entorno (.env)

**Server:**
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_tejidos

JWT_SECRET=tu_secreto_aqui
JWT_EXPIRE=7d
```

**Client:**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Tienda de Tejidos
```

## 🚀 Hosting gratuito

### Base de datos
- **Clever Cloud** (MySQL gratuito): https://www.clever-cloud.com/
- **PlanetScale** (MySQL compatible): https://planetscale.com/
- **Supabase** (PostgreSQL): https://supabase.com/

### Servidor Backend
- **Render**: https://render.com/
- **Railway**: https://railway.app/
- **Vercel** (con serverless functions): https://vercel.com/

### Frontend
- **Vercel**: https://vercel.com/
- **Netlify**: https://netlify.com/

## 🐛 Troubleshooting

**Error: "Can't connect to MySQL server"**
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`
- Comprueba host y puerto

**Error: "CORS policy"**
- Asegúrate que `CLIENT_URL` en `.env` sea correcto
- Reinicia el servidor backend

**Puerto 5000 o 5173 en uso**
```bash
# Cambiar puerto en .env o usar:
PORT=3000 npm run dev
```

## 📞 Soporte

Para preguntas sobre la instalación o configuración, revisa los logs del servidor para más detalles.

---

¡Happy coding! 🧶✨# tejidos-atenea
