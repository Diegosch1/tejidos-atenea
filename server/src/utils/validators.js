// server/src/utils/validators.js
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

const isValidNombre = (nombre) => {
  return nombre && nombre.trim().length >= 2;
};

const validateRegisterInput = (email, password, nombre) => {
  const errors = {};

  if (!email || !isValidEmail(email)) {
    errors.email = 'Email inválido';
  }

  if (!password || !isValidPassword(password)) {
    errors.password = 'La contraseña debe tener mínimo 6 caracteres';
  }

  if (!nombre || !isValidNombre(nombre)) {
    errors.nombre = 'El nombre debe tener mínimo 2 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateLoginInput = (email, password) => {
  const errors = {};

  if (!email || !isValidEmail(email)) {
    errors.email = 'Email inválido';
  }

  if (!password) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidNombre,
  validateRegisterInput,
  validateLoginInput
};