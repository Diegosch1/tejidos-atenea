// server/src/controllers/categoryController.js
const pool = require('../config/database');

// GET /api/categories — listar todas
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY nombre ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getAll categories:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// GET /api/categories/:id — detalle
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error getById category:', err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// POST /api/categories — crear (admin)
const create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre debe tener mínimo 2 caracteres' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (nombre, descripcion) VALUES (?, ?)',
      [nombre.trim(), descripcion?.trim() || null]
    );

    const [created] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error create category:', err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// PUT /api/categories/:id — editar (admin)
const update = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const { id } = req.params;

    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre debe tener mínimo 2 caracteres' });
    }

    const [exists] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (exists.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });

    await pool.query(
      'UPDATE categories SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre.trim(), descripcion?.trim() || null, id]
    );

    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error update category:', err);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// DELETE /api/categories/:id — eliminar (admin)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (exists.length === 0) return res.status(404).json({ error: 'Categoría no encontrada' });

    // Verificar si tiene productos asociados
    const [products] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ?', [id]
    );
    if (products[0].total > 0) {
      return res.status(400).json({
        error: `No se puede eliminar: tiene ${products[0].total} producto(s) asociado(s)`
      });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    console.error('Error remove category:', err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = { getAll, getById, create, update, remove };