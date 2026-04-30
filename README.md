# 🧶 Tejidos Atenea

Aplicación fullstack para gestión y compra de productos de tejido.
Incluye:

* 🛒 Tienda (frontend en React + Vite)
* 🔐 Backend API (Node.js + Express)
* 🗄️ Base de datos MySQL

---

# 🚀 Clonar y ejecutar el proyecto

```bash
git clone https://github.com/Diegosch1/tejidos-atenea
cd tejidos-atenea
```

---

# ⚙️ Backend (server)

## 1. Ir a la carpeta

```bash
cd server
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno (.env)

Ejemplo:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tejidos_atenea
JWT_SECRET=supersecreto
CLIENT_URL=http://localhost:5173
```

## 4. Crear base de datos

Ejecuta el archivo:

```bash
database.sql
```

## 5. Ejecutar servidor

```bash
npm run dev
```

Servidor:
👉 [http://localhost:5000](http://localhost:5000)

---

# 💻 Frontend (client)

## 1. Ir a la carpeta

```bash
cd client
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar .env

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Ejecutar

```bash
npm run dev
```

Frontend:
👉 [http://localhost:5173](http://localhost:5173)

---

# 📁 Estructura del proyecto

```
tejidos-atenea
├── client (React)
├── server (Express API)
└── README.md
```

---

# 🔐 Autenticación

## Registro

```http
POST /api/auth/register
```

Body:

```json
{
  "email": "test@test.com",
  "password": "123456",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

## Login

```http
POST /api/auth/login
```

## Usuario actual

```http
GET /api/auth/me
```

---

# 🧵 Productos

## Obtener productos

```http
GET /api/products
```

## Crear producto (admin)

```http
POST /api/products
```

Form-data:

* nombre
* precio
* imagen

## Eliminar (soft delete)

```http
DELETE /api/products/:id
```

## Reactivar producto

```http
PATCH /api/products/:id/reactivate
```

---

# 📦 Pedidos

## Crear pedido

```http
POST /api/orders
```

## Listar pedidos

```http
GET /api/orders
```

## Detalle

```http
GET /api/orders/:id
```

## Cambiar estado (admin)

```http
PATCH /api/orders/:id/estado
```

## Cancelar pedido

```http
PATCH /api/orders/:id/cancelar
```

---

# 🗂️ Categorías

## Obtener categorías

```http
GET /api/categories
```

## Crear (admin)

```http
POST /api/categories
```

---

# 🧪 Endpoint de prueba

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "OK"
}
```

---

# 👤 Usuarios de prueba

* Admin:

  * email: [admin@tejidosatenea.com](mailto:admin@tejidos.com)
  * password: 123456

* Cliente:

  * email: [kory@gmail.com](mailto:cliente@ejemplo.com)
  * password: 123456

---

# 🛠️ Tecnologías

## Frontend

* React
* Vite
* Context API

## Backend

* Node.js
* Express
* MySQL
* JWT

---

# 📌 Notas

* Autenticación basada en cookies
* Subida de imágenes con multer
* Soft delete en productos
* Roles: admin / customer

---

# 👨‍💻 Autor

Proyecto desarrollado por Kory Bonilla.
