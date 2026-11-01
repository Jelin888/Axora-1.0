const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MessageAttachment = sequelize.define('MessageAttachment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  messageId: { type: DataTypes.INTEGER, allowNull: false },
  fileName: { type: DataTypes.STRING(255) },
  fileUrl: { type: DataTypes.STRING(500) },
  fileType: { type: DataTypes.STRING(50) },
}, { tableName: 'message_attachments' });

module.exports = MessageAttachment;
