// server/src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

// Middleware para verificar token en cookies
const verifyAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;    

    if (!token) {
      return res.status(401).json({ error: 'Token no encontrado' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};

// Middleware para verificar si es admin
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Token no encontrado' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    
    req.user = decoded;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: solo admins' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};

module.exports = {
  verifyAuth,
  verifyAdmin
};