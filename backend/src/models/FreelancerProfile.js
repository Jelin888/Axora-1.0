const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FreelancerProfile = sequelize.define('FreelancerProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  professionalTitle: { type: DataTypes.STRING(200) },
  bio: { type: DataTypes.STRING(2000) },
  location: { type: DataTypes.STRING(150) },
  experienceYears: { type: DataTypes.INTEGER },
  hourlyRate: { type: DataTypes.DECIMAL(10, 2) },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  linkedinUrl: { type: DataTypes.STRING(500) },
  githubUrl: { type: DataTypes.STRING(500) },
  websiteUrl: { type: DataTypes.STRING(500) },
  averageRating: { type: DataTypes.DOUBLE, defaultValue: 0 },
  completedProjects: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'freelancer_profiles' });

module.exports = FreelancerProfile;
