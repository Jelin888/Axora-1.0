const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }, // bcrypt hashed
  role: { type: DataTypes.ENUM('ROLE_FREELANCER', 'ROLE_CLIENT', 'ROLE_ADMIN'), allowNull: false },
  status: { type: DataTypes.ENUM('ACTIVE', 'SUSPENDED'), defaultValue: 'ACTIVE' },
  profilePhotoUrl: { type: DataTypes.STRING(500) },
  phone: { type: DataTypes.STRING(30) },
}, { tableName: 'users' });

module.exports = User;
