const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Skill = sequelize.define('Skill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { tableName: 'skills' });

module.exports = Skill;
