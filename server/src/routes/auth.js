// server/src/routes/auth.js
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrentUser
} = require('../controllers/authController');
const { verifyAuth } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', verifyAuth, getCurrentUser);
router.post('/logout', verifyAuth, logout);

module.exports = router;