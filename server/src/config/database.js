// server/src/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
pool.getConnection()
  .then(connection => {
    console.log('Conexión a MySQL establecida');
    connection.release();
  })
  .catch(err => {
    console.error('Error de conexión a MySQL:', err.message);
  });

module.exports = pool;