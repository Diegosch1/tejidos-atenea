// server/src/routes/orders.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');
const { verifyAuth, verifyAdmin } = require('../middleware/auth');

// Crear pedido — cliente autenticado
router.post('/', verifyAuth, ctrl.create);

// Listar pedidos — admin ve todos, cliente ve los suyos
router.get('/', verifyAuth, ctrl.getAll);

// Detalle de pedido — admin o dueño
router.get('/:id', verifyAuth, ctrl.getById);

// Actualizar estado — solo admin
router.patch('/:id/estado', verifyAdmin, ctrl.updateEstado);

// Cancelar pedido propio — solo el cliente dueño
router.patch('/:id/cancelar', verifyAuth, ctrl.cancelOwn);

module.exports = router;