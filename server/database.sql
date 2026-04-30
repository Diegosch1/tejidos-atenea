-- ============================================================
-- tejidos_atenea — script completo
-- Ejecutar una sola vez sobre una base de datos vacía
-- ============================================================

CREATE DATABASE IF NOT EXISTS tejidos_atenea
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tejidos_atenea;

-- ─── 1. USUARIOS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  nombre     VARCHAR(255) NOT NULL,
  apellido   VARCHAR(255),
  role       ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ─── 2. CATEGORÍAS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── 3. PRODUCTOS ───────────────────────────────────────────
-- category_id referencia categories; imagen_path guarda el nombre
-- del archivo subido a /uploads
CREATE TABLE IF NOT EXISTS products (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio      DECIMAL(10, 2) NOT NULL,
  stock       INT DEFAULT 0,
  category_id INT,
  imagen_path VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category_id (category_id)
);

-- ─── 4. PEDIDOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  estado      ENUM('pendiente','confirmado','enviado','entregado','cancelado') DEFAULT 'pendiente',
  total       DECIMAL(10, 2) NOT NULL,
  metodo_pago ENUM('tarjeta','transferencia','efectivo') NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_estado  (estado)
);

-- ─── 5. ITEMS DE PEDIDO ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  order_id        INT NOT NULL,
  product_id      INT NOT NULL,
  cantidad        INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal        DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id)
);

-- ============================================================
-- DATOS DE EJEMPLO
-- Contraseña de ambos usuarios: 123456
-- ============================================================

INSERT INTO users (email, password, nombre, apellido, role) VALUES
('admin@tejidos.com',   '$2a$10$YJvlHqvHkLdBFXQQhBBxv.O7v4PBwf8zM3gWiJaJvK5sZ3Oi6k3jK', 'Admin', 'Atenea', 'admin'),
('cliente@ejemplo.com', '$2a$10$YJvlHqvHkLdBFXQQhBBxv.O7v4PBwf8zM3gWiJaJvK5sZ3Oi6k3jK', 'Juan',  'Pérez',  'customer');

INSERT INTO categories (nombre, descripcion) VALUES
('Lana',     'Hilos y ovillos de lana natural'),
('Algodón',  'Hilos de algodón orgánico e industrial'),
('Seda',     'Hilos de seda pura y mezclas'),
('Acrílico', 'Hilos sintéticos resistentes y fáciles de cuidar'),
('Agujas',   'Agujas de tejer, crochet y accesorios'),
('Patrones', 'Patrones impresos y digitales');

-- Los productos de ejemplo no tienen imagen (se subirán desde el panel admin)
INSERT INTO products (nombre, descripcion, precio, stock, category_id) VALUES
('Lana Merino Premium', 'Lana de oveja merino de alta calidad, perfecta para prendas delicadas', 25.99,  50, 1),
('Algodón Orgánico',    'Algodón 100% orgánico, suave y transpirable',                           18.50,  75, 2),
('Hilo de Seda',        'Hilo de seda pura, con brillo natural y suavidad excepcional',          45.00,  30, 3),
('Mezcla Acrílica',     'Hilo acrílico resistente y fácil de cuidar',                           12.99, 100, 4);