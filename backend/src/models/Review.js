const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  reviewerId: { type: DataTypes.INTEGER, allowNull: false },
  revieweeId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING(2000) },
}, {
  tableName: 'reviews',
  indexes: [{ unique: true, fields: ['project_id', 'reviewer_id'] }],
});

module.exports = Review;
