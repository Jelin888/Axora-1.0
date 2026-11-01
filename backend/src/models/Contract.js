const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contract = sequelize.define('Contract', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  freelancerId: { type: DataTypes.INTEGER, allowNull: false },
  progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'contracts' });

module.exports = Contract;
