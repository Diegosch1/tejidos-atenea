// server/src/routes/categories.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/auth');

// Públicas (cualquiera puede ver las categorías para filtrar)
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

// Solo admin
router.post('/',    verifyAdmin, ctrl.create);
router.put('/:id',  verifyAdmin, ctrl.update);
router.delete('/:id', verifyAdmin, ctrl.remove);

module.exports = router;