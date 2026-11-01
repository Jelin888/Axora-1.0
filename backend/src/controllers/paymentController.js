const crypto = require('crypto');
const { Payment, Project, User, Milestone, Contract } = require('../models');
const { Op } = require('sequelize');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { paymentDto } = require('../utils/serializers');
const notify = require('../utils/notify');

const include = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'payer', attributes: ['id', 'fullName'] },
  { model: User, as: 'receiver', attributes: ['id', 'fullName'] },
];

// Creates a PENDING payment record + a UPI deep-link.
// Only transaction metadata is stored — never UPI PINs, card numbers, OTPs or bank credentials.
exports.create = asyncHandler(async (req, res) => {
  const { projectId, milestoneId, receiverId, amount, upiId } = req.body;
  if (!projectId || !receiverId || !amount || Number(amount) <= 0) return error(res, 'Project, receiver and a positive amount are required');

  const project = await Project.findByPk(projectId);
  if (!project) return error(res, 'Project not found', 404);
  if (project.clientId !== req.user.id) return error(res, 'Only the project owner can pay for this project', 403);

  // Money can only go to the freelancer who holds this project's contract
  const contract = await Contract.findOne({ where: { projectId: project.id } });
  if (!contract) return error(res, 'Payments are only possible once a proposal has been accepted');
  if (Number(receiverId) !== contract.freelancerId) return error(res, 'Receiver must be the freelancer working on this project');
  if (milestoneId) {
    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone || milestone.contractId !== contract.id) return error(res, 'Milestone not found for this project', 404);
  }

  const payment = await Payment.create({
    transactionId: `TXN${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
    projectId, milestoneId: milestoneId || null, payerId: req.user.id, receiverId, amount, upiId: upiId || null, status: 'PENDING',
  });
  return success(res, 'Payment initiated', paymentDto(await Payment.findByPk(payment.id, { include })), 201);
});

exports.my = asyncHandler(async (req, res) => {
  const payments = await Payment.findAll({
    where: { [Op.or]: [{ payerId: req.user.id }, { receiverId: req.user.id }] }, include, order: [['createdAt', 'DESC']],
  });
  return success(res, 'OK', payments.map(paymentDto));
});

exports.getById = asyncHandler(async (req, res) => {
  const p = await Payment.findByPk(req.params.id, { include });
  if (!p) return error(res, 'Payment not found', 404);
  if (![p.payerId, p.receiverId].includes(req.user.id) && req.user.role !== 'ROLE_ADMIN') return error(res, 'Not your payment', 403);
  return success(res, 'OK', paymentDto(p));
});

// DEMO confirmation: the payer confirms they completed the UPI payment.
// In production, replace this with a webhook from a verified payment provider.
exports.markSuccess = asyncHandler(async (req, res) => {
  const p = await Payment.findByPk(req.params.id, { include });
  if (!p) return error(res, 'Payment not found', 404);
  if (p.payerId !== req.user.id) return error(res, 'Only the payer can confirm this payment', 403);
  if (p.status !== 'PENDING') return error(res, `Payment is already ${p.status}`);

  p.status = 'SUCCESS';
  await p.save();
  if (p.milestoneId) await Milestone.update({ status: 'PAID' }, { where: { id: p.milestoneId } });
  await notify(p.receiverId, `Payment of ₹${Number(p.amount)} received for "${p.project.title}"`, 'PAYMENT');
  return success(res, 'Payment marked successful', paymentDto(p));
});
