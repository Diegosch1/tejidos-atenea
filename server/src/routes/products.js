// server/src/routes/products.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Públicas
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

// Solo admin — upload.single('imagen') procesa el archivo antes del controlador
router.post('/',    verifyAdmin, upload.single('imagen'), ctrl.create);
router.put('/:id',  verifyAdmin, upload.single('imagen'), ctrl.update);
router.delete('/:id', verifyAdmin, ctrl.remove);

module.exports = router;