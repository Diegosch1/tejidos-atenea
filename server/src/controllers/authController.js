// server/src/controllers/authController.js
const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { generateToken } = require('../utils/jwt');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body;

    // Validar entrada
    const validation = validateRegisterInput(email, password, nombre);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const connection = await pool.getConnection();

    try {
      // Verificar si el email ya existe
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Hash de contraseña
      const hashedPassword = await hashPassword(password);

      // Crear usuario
      const [result] = await connection.query(
        'INSERT INTO users (email, password, nombre, apellido, role) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, nombre, apellido || null, 'customer']
      );

      const userId = result.insertId;

      // Generar token
      const token = generateToken(userId, 'customer');

      // Enviar token en cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      // Responder con datos del usuario (sin la contraseña)
      res.status(201).json({
        message: 'Usuario registrado e iniciado sesión correctamente',
        user: {
          id: userId,
          email,
          nombre,
          apellido: apellido || null,
          role: 'customer'
        }
      });

    } finally {
      connection.release();
    }

  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar entrada
    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const connection = await pool.getConnection();

    try {
      // Buscar usuario por email
      const [users] = await connection.query(
        'SELECT id, email, nombre, apellido, password, role FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }

      const user = users[0];

      // Verificar contraseña
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }

      // Generar token
      const token = generateToken(user.id, user.role);

      // Enviar token en cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      // Responder con datos del usuario
      res.json({
        message: 'Sesión iniciada correctamente',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role
        }
      });

    } finally {
      connection.release();
    }

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// LOGOUT
const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error('Error en logout:', err);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

// GET CURRENT USER (verificar si hay sesión activa)
const getCurrentUser = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        'SELECT id, email, nombre, apellido, role FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ user: users[0] });

    } finally {
      connection.release();
    }

  } catch (err) {
    console.error('Error en getCurrentUser:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};