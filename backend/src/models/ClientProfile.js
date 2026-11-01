const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClientProfile = sequelize.define('ClientProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING(200) },
  about: { type: DataTypes.STRING(2000) },
  location: { type: DataTypes.STRING(150) },
  website: { type: DataTypes.STRING(500) },
}, { tableName: 'client_profiles' });

module.exports = ClientProfile;
