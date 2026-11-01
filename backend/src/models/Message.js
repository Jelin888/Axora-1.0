const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.STRING(3000) },
  status: { type: DataTypes.ENUM('SENT', 'DELIVERED', 'READ'), defaultValue: 'SENT' },
}, { tableName: 'messages' });

module.exports = Message;
