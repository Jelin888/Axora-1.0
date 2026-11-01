require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuration kept simple and readable — edit DB_* values in .env to match
// your MySQL setup. Defaults match a stock XAMPP install (root / no password).
const sequelize = new Sequelize(
  process.env.DB_NAME || 'axora_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // set to console.log to see generated SQL
    define: {
      underscored: true, // created_at / updated_at, snake_case columns
      timestamps: true,
    },
  }
);

module.exports = sequelize;
