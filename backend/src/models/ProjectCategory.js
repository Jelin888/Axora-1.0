const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectCategory = sequelize.define('ProjectCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { tableName: 'project_categories' });

module.exports = ProjectCategory;
