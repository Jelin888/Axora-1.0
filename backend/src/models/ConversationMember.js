const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ConversationMember = sequelize.define('ConversationMember', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'conversation_members' });

module.exports = ConversationMember;
