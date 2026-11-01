const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proposal = sequelize.define('Proposal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  freelancerId: { type: DataTypes.INTEGER, allowNull: false },
  coverLetter: { type: DataTypes.STRING(3000) },
  proposedAmount: { type: DataTypes.DECIMAL(12, 2) },
  estimatedDeliveryDays: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'), defaultValue: 'PENDING' },
}, {
  tableName: 'proposals',
  indexes: [{ unique: true, fields: ['project_id', 'freelancer_id'] }],
});

module.exports = Proposal;
