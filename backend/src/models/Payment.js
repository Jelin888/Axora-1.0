const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  transactionId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  milestoneId: { type: DataTypes.INTEGER, allowNull: true },
  payerId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12, 2) },
  status: { type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'), defaultValue: 'PENDING' },
  upiId: { type: DataTypes.STRING(150) },
}, { tableName: 'payments' });

module.exports = Payment;
