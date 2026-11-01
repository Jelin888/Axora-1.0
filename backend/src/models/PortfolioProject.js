const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PortfolioProject = sequelize.define('PortfolioProject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  freelancerId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(3000) },
  technologies: { type: DataTypes.STRING(500) },
  imageUrl: { type: DataTypes.STRING(500) },
  githubUrl: { type: DataTypes.STRING(500) },
  liveDemoUrl: { type: DataTypes.STRING(500) },
  completionDate: { type: DataTypes.DATEONLY },
  category: { type: DataTypes.STRING(100) },
}, { tableName: 'portfolio_projects' });

module.exports = PortfolioProject;
