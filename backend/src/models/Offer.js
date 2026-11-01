const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Offer = sequelize.define('Offer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(2000) },
  imageUrl: { type: DataTypes.STRING(500) },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXPIRED'), defaultValue: 'ACTIVE' },
}, { tableName: 'offers' });

module.exports = Offer;
