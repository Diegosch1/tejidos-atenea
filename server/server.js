// server/server.js
const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║        TEJIDOS ATENEA BACKEND         ║
║  Servidor corriendo en puerto ${PORT}    ║
║  URL: http://localhost:${PORT}           ║
╚═══════════════════════════════════════╝
  `);
});

// Manejar cierre gracioso
process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nCerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});