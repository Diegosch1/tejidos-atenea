-- server/database.sql
-- Script para crear la base de datos y tablas

CREATE DATABASE IF NOT EXISTS tejidos_atenea;
USE tejidos_atenea;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(100),
  imagen_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'enviado', 'entregado') DEFAULT 'pendiente',
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Tabla de items en pedidos
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_id (order_id)
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Modificar tabla products para referenciar categoría por ID
-- (Si ya creaste la tabla, ejecuta solo el ALTER)
ALTER TABLE products
  DROP COLUMN categoria,
  ADD COLUMN category_id INT,
  ADD COLUMN imagen_path VARCHAR(500),
  ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Categorías de ejemplo para tejidos
INSERT INTO categories (nombre, descripcion) VALUES
('Lana',    'Hilos y ovillos de lana natural'),
('Algodón', 'Hilos de algodón orgánico e industrial'),
('Seda',    'Hilos de seda pura y mezclas'),
('Acrílico','Hilos sintéticos resistentes y fáciles de cuidar'),
('Agujas',  'Agujas de tejer, crochet y accesorios'),
('Patrones','Patrones impresos y digitales');

-- Datos de ejemplo para pruebas
INSERT INTO users (email, password, nombre, apellido, role) VALUES
('admin@tejidos.com', '$2a$10$YJvlHqvHkLdBFXQQhBBxv.O7v4PBwf8zM3gWiJaJvK5sZ3Oi6k3jK', 'Admin', 'Tejidos', 'admin'),
('cliente@ejemplo.com', '$2a$10$YJvlHqvHkLdBFXQQhBBxv.O7v4PBwf8zM3gWiJaJvK5sZ3Oi6k3jK', 'Juan', 'Pérez', 'customer');

INSERT INTO products (nombre, descripcion, precio, stock, categoria, imagen_url) VALUES
('Lana Merino Premium', 'Lana de oveja merino de alta calidad, perfecta para prendas delicadas', 25.99, 50, 'lana', 'https://via.placeholder.com/300?text=Lana+Merino'),
('Algodón Orgánico', 'Algodón 100% orgánico, suave y transpirable', 18.50, 75, 'algodon', 'https://via.placeholder.com/300?text=Algodon'),
('Hilo de Seda', 'Hilo de seda pura, con brillo natural y suavidad excepcional', 45.00, 30, 'seda', 'https://via.placeholder.com/300?text=Seda'),
('Mezcla Acrílica', 'Hilo acrílico resistente y fácil de cuidar', 12.99, 100, 'acrilico', 'https://via.placeholder.com/300?text=Acrilico');