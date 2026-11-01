const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(5000), allowNull: false },
  requiredSkills: { type: DataTypes.STRING(500) }, // comma separated
  categoryId: { type: DataTypes.INTEGER },
  budget: { type: DataTypes.DECIMAL(12, 2) },
  deadline: { type: DataTypes.DATEONLY },
  projectType: { type: DataTypes.ENUM('FIXED_PRICE', 'HOURLY'), defaultValue: 'FIXED_PRICE' },
  status: { type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'), defaultValue: 'OPEN' },
  attachmentUrl: { type: DataTypes.STRING(500) },
}, { tableName: 'projects' });

module.exports = Project;
