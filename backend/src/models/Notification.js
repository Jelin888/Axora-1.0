const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.STRING(500), allowNull: false },
  type: { type: DataTypes.STRING(50) },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'notifications' });

module.exports = Notification;
