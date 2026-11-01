const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contractId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2) },
  status: { type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'PAID'), defaultValue: 'PENDING' },
}, { tableName: 'milestones' });

module.exports = Milestone;
