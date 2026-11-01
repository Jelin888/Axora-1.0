const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(3000) },
  imageUrl: { type: DataTypes.STRING(500) },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'announcements' });

module.exports = Announcement;
