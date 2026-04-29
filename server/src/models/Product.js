// server/src/models/Product.js
const pool = require('../config/database');

const Product = {

  async findAll({ categoria, search, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    if (search) {
      query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(query, params);
      return rows;
    } finally {
      connection.release();
    }
  },

  async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      connection.release();
    }
  },

  async create({ nombre, descripcion, precio, stock, categoria, imagen_url }) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO products (nombre, descripcion, precio, stock, categoria, imagen_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, descripcion || null, precio, stock ?? 0, categoria || null, imagen_url || null]
      );
      return await Product.findById(result.insertId);
    } finally {
      connection.release();
    }
  },

  async update(id, { nombre, descripcion, precio, stock, categoria, imagen_url }) {
    const fields = [];
    const params = [];

    if (nombre !== undefined)      { fields.push('nombre = ?');      params.push(nombre); }
    if (descripcion !== undefined) { fields.push('descripcion = ?'); params.push(descripcion); }
    if (precio !== undefined)      { fields.push('precio = ?');      params.push(precio); }
    if (stock !== undefined)       { fields.push('stock = ?');       params.push(stock); }
    if (categoria !== undefined)   { fields.push('categoria = ?');   params.push(categoria); }
    if (imagen_url !== undefined)  { fields.push('imagen_url = ?');  params.push(imagen_url); }

    if (fields.length === 0) return await Product.findById(id);

    params.push(id);
    const connection = await pool.getConnection();
    try {
      await connection.query(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        params
      );
      return await Product.findById(id);
    } finally {
      connection.release();
    }
  },

  async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'DELETE FROM products WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  },

  async getCategories() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT DISTINCT categoria FROM products WHERE categoria IS NOT NULL ORDER BY categoria'
      );
      return rows.map(r => r.categoria);
    } finally {
      connection.release();
    }
  }
};

module.exports = Product;