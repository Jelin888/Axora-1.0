require('dotenv').config();
const mysql = require('mysql2/promise');
const app = require('./src/app');
const { sequelize } = require('./src/models');
const { seedIfEmpty } = require('./src/utils/seed');

const PORT = process.env.PORT || 8081;

// Create the database automatically if it doesn't exist yet (handy with a fresh XAMPP install)
async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'axora_db'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();
}

(async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing — copy .env.example to .env');
    await ensureDatabase();
    await sequelize.authenticate();
    await sequelize.sync(); // creates any missing tables; never drops data
    await seedIfEmpty();
    app.listen(PORT, () => console.log(`AXORA API running on http://localhost:${PORT}/api  (DB: ${process.env.DB_NAME || 'axora_db'})`));
  } catch (err) {
    console.error('\nCould not start AXORA backend:', err.message);
    if (/ECONNREFUSED|ER_ACCESS_DENIED|ENOTFOUND/.test(err.message + (err.code || ''))) {
      console.error('-> Is MySQL running in XAMPP? Check DB_HOST / DB_PORT / DB_USER / DB_PASSWORD in backend/.env');
    }
    process.exit(1);
  }
})();
