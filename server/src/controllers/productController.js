// server/src/controllers/productController.js
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Elimina el archivo de imagen del disco si existe
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, '../../uploads', path.basename(imagePath));
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// GET /api/products — listado público con filtros opcionales
const getAll = async (req, res) => {
  try {
    const { category_id, precio_min, precio_max, page = 1, limit = 12 } = req.query;

    let where = [];
    let params = [];

    if (category_id) {
      where.push('p.category_id = ?');
      params.push(category_id);
    }
    if (precio_min) {
      where.push('p.precio >= ?');
      params.push(Number(precio_min));
    }
    if (precio_max) {
      where.push('p.precio <= ?');
      params.push(Number(precio_max));
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Paginación
    const offset = (Number(page) - 1) * Number(limit);

    const [rows] = await pool.query(
      `SELECT 
        p.id, p.nombre, p.descripcion, p.precio, p.stock,
        p.imagen_path, p.created_at,
        c.id AS category_id, c.nombre AS categoria
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );

    res.json({
      products: rows,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error getAll products:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// GET /api/products/:id — detalle
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        p.id, p.nombre, p.descripcion, p.precio, p.stock,
        p.imagen_path, p.created_at,
        c.id AS category_id, c.nombre AS categoria
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error getById product:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// POST /api/products — crear (admin)
const create = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, category_id } = req.body;
    const imagen_path = req.file ? req.file.filename : null;

    // Validaciones
    const errors = {};
    if (!nombre || nombre.trim().length < 2) errors.nombre = 'Nombre requerido (mínimo 2 caracteres)';
    if (!precio || isNaN(precio) || Number(precio) <= 0) errors.precio = 'Precio inválido';
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) errors.stock = 'Stock inválido';

    if (Object.keys(errors).length) {
      if (imagen_path) deleteImageFile(imagen_path);
      return res.status(400).json({ errors });
    }

    // Verificar categoría si se envió
    if (category_id) {
      const [cat] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
      if (cat.length === 0) {
        if (imagen_path) deleteImageFile(imagen_path);
        return res.status(400).json({ error: 'Categoría no encontrada' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO products (nombre, descripcion, precio, stock, category_id, imagen_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        descripcion?.trim() || null,
        Number(precio),
        Number(stock),
        category_id || null,
        imagen_path
      ]
    );

    const [created] = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json(created[0]);
  } catch (err) {
    if (req.file) deleteImageFile(req.file.filename);
    console.error('Error create product:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// PUT /api/products/:id — editar (admin)
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, category_id } = req.body;
    const newImage = req.file ? req.file.filename : null;

    // Verificar que el producto existe
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      if (newImage) deleteImageFile(newImage);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validaciones
    const errors = {};
    if (!nombre || nombre.trim().length < 2) errors.nombre = 'Nombre requerido (mínimo 2 caracteres)';
    if (!precio || isNaN(precio) || Number(precio) <= 0) errors.precio = 'Precio inválido';
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) errors.stock = 'Stock inválido';

    if (Object.keys(errors).length) {
      if (newImage) deleteImageFile(newImage);
      return res.status(400).json({ errors });
    }

    // Si se sube imagen nueva, eliminar la anterior
    const oldProduct = existing[0];
    if (newImage && oldProduct.imagen_path) {
      deleteImageFile(oldProduct.imagen_path);
    }

    const imagen_path = newImage || oldProduct.imagen_path;

    await pool.query(
      `UPDATE products
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, category_id = ?, imagen_path = ?
       WHERE id = ?`,
      [
        nombre.trim(),
        descripcion?.trim() || null,
        Number(precio),
        Number(stock),
        category_id || null,
        imagen_path,
        id
      ]
    );

    const [updated] = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    res.json(updated[0]);
  } catch (err) {
    if (req.file) deleteImageFile(req.file.filename);
    console.error('Error update product:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// DELETE /api/products/:id — eliminar (admin)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    // Eliminar imagen del disco
    if (existing[0].imagen_path) deleteImageFile(existing[0].imagen_path);

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error remove product:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = { getAll, getById, create, update, remove };