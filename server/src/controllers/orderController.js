// server/src/controllers/orderController.js
const pool = require('../config/database');

const METODOS_PAGO  = ['tarjeta', 'transferencia', 'efectivo'];
const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

// ─── Helpers ────────────────────────────────────────────────────────────────

// Devuelve el pedido completo con sus items
const fetchOrderById = async (connection, orderId) => {
  const [[order]] = await connection.query(
    `SELECT 
       o.id, o.user_id, o.estado, o.total, o.metodo_pago, o.created_at, o.updated_at,
       u.nombre AS cliente_nombre, u.apellido AS cliente_apellido, u.email AS cliente_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = ?`,
    [orderId]
  );

  if (!order) return null;

  const [items] = await connection.query(
    `SELECT 
       oi.id, oi.cantidad, oi.precio_unitario, oi.subtotal,
       p.id AS product_id, p.nombre AS product_nombre, p.imagen_path
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return { ...order, items };
};

// ─── POST /api/orders ────────────────────────────────────────────────────────
// Crea un pedido a partir del carrito enviado desde el cliente.
// Body: { metodo_pago, items: [{ product_id, cantidad }] }
const create = async (req, res) => {
  const { metodo_pago, items } = req.body;
  const userId = req.user.id;

  // Validar método de pago
  if (!metodo_pago || !METODOS_PAGO.includes(metodo_pago)) {
    return res.status(400).json({
      error: `Método de pago inválido. Opciones: ${METODOS_PAGO.join(', ')}`
    });
  }

  // Validar estructura del carrito
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  for (const item of items) {
    if (!item.product_id || !item.cantidad || item.cantidad < 1) {
      return res.status(400).json({
        error: 'Cada item debe tener product_id y cantidad >= 1'
      });
    }
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    let total = 0;
    const resolvedItems = [];

    // Verificar stock y precios con bloqueo de fila (FOR UPDATE)
    for (const item of items) {
      const [[product]] = await connection.query(
        'SELECT id, nombre, precio, stock FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );

      if (!product) {
        await connection.rollback();
        return res.status(404).json({
          error: `Producto con id ${item.product_id} no encontrado`
        });
      }

      if (product.stock < item.cantidad) {
        await connection.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para "${product.nombre}". Disponible: ${product.stock}`
        });
      }

      const subtotal = Number(product.precio) * item.cantidad;
      total += subtotal;

      resolvedItems.push({
        product_id:     product.id,
        product_nombre: product.nombre,
        cantidad:       item.cantidad,
        precio_unitario: Number(product.precio),
        subtotal
      });
    }

    // Crear el pedido
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, estado, total, metodo_pago) VALUES (?, ?, ?, ?)',
      [userId, 'pendiente', total, metodo_pago]
    );
    const orderId = orderResult.insertId;

    // Insertar los items y descontar stock
    for (const item of resolvedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.cantidad, item.precio_unitario, item.subtotal]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.product_id]
      );
    }

    await connection.commit();

    const fullOrder = await fetchOrderById(connection, orderId);
    res.status(201).json(fullOrder);

  } catch (err) {
    await connection.rollback();
    console.error('Error create order:', err);
    res.status(500).json({ error: 'Error al crear el pedido' });
  } finally {
    connection.release();
  }
};

// ─── GET /api/orders ─────────────────────────────────────────────────────────
// Admin: todos los pedidos. Cliente: solo los suyos.
const getAll = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const { estado, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where  = [];
    let params = [];

    if (!isAdmin) {
      where.push('o.user_id = ?');
      params.push(req.user.id);
    }
    if (estado && ESTADOS_VALIDOS.includes(estado)) {
      where.push('o.estado = ?');
      params.push(estado);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [orders] = await pool.query(
      `SELECT
         o.id, o.estado, o.total, o.metodo_pago, o.created_at,
         u.nombre AS cliente_nombre, u.apellido AS cliente_apellido, u.email AS cliente_email,
         COUNT(oi.id) AS total_items
       FROM orders o
       JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    // 🔥 NUEVO: traer items por cada pedido
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT 
           oi.cantidad, 
           oi.precio_unitario,
           p.id AS product_id,
           p.nombre
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      order.items = items;
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      params
    );

    res.json({
      orders,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error getAll orders:', err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
// Admin ve cualquiera. Cliente solo los suyos.
const getById = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const order = await fetchOrderById(connection, req.params.id);

    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    // Cliente solo puede ver sus propios pedidos
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes acceso a este pedido' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error getById order:', err);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  } finally {
    connection.release();
  }
};

// ─── PATCH /api/orders/:id/estado ────────────────────────────────────────────
// Solo admin. Avanza o cancela el estado del pedido.
// Si se cancela, devuelve el stock a los productos.
const updateEstado = async (req, res) => {
  const { estado } = req.body;
  const { id }     = req.params;

  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      error: `Estado inválido. Opciones: ${ESTADOS_VALIDOS.join(', ')}`
    });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [[order]] = await connection.query(
      'SELECT id, estado FROM orders WHERE id = ? FOR UPDATE',
      [id]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // No se puede modificar un pedido ya cancelado o entregado
    if (order.estado === 'cancelado') {
      await connection.rollback();
      return res.status(400).json({ error: 'No se puede modificar un pedido cancelado' });
    }
    if (order.estado === 'entregado') {
      await connection.rollback();
      return res.status(400).json({ error: 'No se puede modificar un pedido entregado' });
    }

    // Si se cancela, devolver stock
    if (estado === 'cancelado') {
      const [items] = await connection.query(
        'SELECT product_id, cantidad FROM order_items WHERE order_id = ?',
        [id]
      );
      for (const item of items) {
        await connection.query(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.cantidad, item.product_id]
        );
      }
    }

    await connection.query(
      'UPDATE orders SET estado = ? WHERE id = ?',
      [estado, id]
    );

    await connection.commit();

    const fullOrder = await fetchOrderById(connection, id);
    res.json(fullOrder);

  } catch (err) {
    await connection.rollback();
    console.error('Error updateEstado order:', err);
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  } finally {
    connection.release();
  }
};

// ─── PATCH /api/orders/:id/cancelar ──────────────────────────────────────────
// Solo el cliente dueño del pedido puede cancelarlo, y solo si está en "pendiente".
const cancelOwn = async (req, res) => {
  const { id }   = req.params;
  const userId   = req.user.id;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [[order]] = await connection.query(
      'SELECT id, estado, user_id FROM orders WHERE id = ? FOR UPDATE',
      [id]
    );

    if (!order) {
      await connection.rollback();
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (order.user_id !== userId && req.user.role !== 'admin') {
      await connection.rollback();
      return res.status(403).json({ error: 'No tienes acceso a este pedido' });
    }

    if (order.estado !== 'pendiente' && req.user.role !== 'admin') {
      await connection.rollback();
      return res.status(400).json({
        error: `Solo puedes cancelar pedidos en estado "pendiente". Estado actual: ${order.estado}`
      });
    }

    // Devolver stock
    const [items] = await connection.query(
      'SELECT product_id, cantidad FROM order_items WHERE order_id = ?',
      [id]
    );
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.cantidad, item.product_id]
      );
    }

    await connection.query(
      'UPDATE orders SET estado = ? WHERE id = ?',
      ['cancelado', id]
    );

    await connection.commit();

    const fullOrder = await fetchOrderById(connection, id);
    res.json(fullOrder);

  } catch (err) {
    await connection.rollback();
    console.error('Error cancelOwn order:', err);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  } finally {
    connection.release();
  }
};

module.exports = { create, getAll, getById, updateEstado, cancelOwn };