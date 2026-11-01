const { Op } = require('sequelize');
const { Contract, Milestone, Project, User, FreelancerProfile } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notify = require('../utils/notify');

const include = [
  { model: Project, as: 'project', attributes: ['id', 'title', 'budget', 'deadline', 'status'] },
  { model: User, as: 'client', attributes: ['id', 'fullName', 'profilePhotoUrl'] },
  { model: User, as: 'freelancer', attributes: ['id', 'fullName', 'profilePhotoUrl'] },
  { model: Milestone, as: 'milestones' },
];

const isParty = (c, u) => [c.clientId, c.freelancerId].includes(u.id) || u.role === 'ROLE_ADMIN';

exports.my = asyncHandler(async (req, res) => {
  const contracts = await Contract.findAll({
    where: { [Op.or]: [{ clientId: req.user.id }, { freelancerId: req.user.id }] }, include, order: [['createdAt', 'DESC']],
  });
  return success(res, 'OK', contracts);
});

exports.byProject = asyncHandler(async (req, res) => {
  const c = await Contract.findOne({ where: { projectId: req.params.projectId }, include });
  if (!c) return error(res, 'No workspace exists for this project yet', 404);
  if (!isParty(c, req.user)) return error(res, 'Not your workspace', 403);
  return success(res, 'OK', c);
});

// Client defines milestones
exports.addMilestone = asyncHandler(async (req, res) => {
  const c = await Contract.findByPk(req.params.id);
  if (!c) return error(res, 'Contract not found', 404);
  if (c.clientId !== req.user.id) return error(res, 'Only the client can add milestones', 403);
  if (!req.body.title || !req.body.amount) return error(res, 'Title and amount are required');
  const m = await Milestone.create({ contractId: c.id, title: req.body.title, amount: req.body.amount });
  return success(res, 'Milestone added', m, 201);
});

// Milestone flow: PENDING -> IN_PROGRESS -> SUBMITTED (freelancer) -> APPROVED (client) -> PAID (via payment)
const FREELANCER_MOVES = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'SUBMITTED' };
exports.updateMilestone = asyncHandler(async (req, res) => {
  const m = await Milestone.findByPk(req.params.id, { include: [{ model: Contract, as: 'contract' }] });
  if (!m) return error(res, 'Milestone not found', 404);
  const c = m.contract;
  const next = req.body.status;

  if (req.user.id === c.freelancerId && FREELANCER_MOVES[m.status] === next) {
    m.status = next;
    if (next === 'SUBMITTED') await notify(c.clientId, `Milestone "${m.title}" was submitted for review`, 'MILESTONE');
  } else if (req.user.id === c.clientId && m.status === 'SUBMITTED' && next === 'APPROVED') {
    m.status = 'APPROVED';
    await notify(c.freelancerId, `Milestone "${m.title}" was approved`, 'MILESTONE');
  } else {
    return error(res, `You cannot move this milestone from ${m.status} to ${next}`, 403);
  }
  await m.save();
  return success(res, 'Milestone updated', m);
});

// Freelancer reports progress; 100% completes the project
exports.updateProgress = asyncHandler(async (req, res) => {
  const c = await Contract.findByPk(req.params.id);
  if (!c) return error(res, 'Contract not found', 404);
  if (c.freelancerId !== req.user.id) return error(res, 'Only the freelancer can update progress', 403);
  const pct = Number(req.body.progressPercent);
  if (![0, 25, 50, 75, 100].includes(pct)) return error(res, 'Progress must be 0, 25, 50, 75 or 100');

  c.progressPercent = pct;
  await c.save();
  if (pct === 100) {
    const project = await Project.findByPk(c.projectId);
    if (project.status !== 'COMPLETED') {
      project.status = 'COMPLETED';
      await project.save();
      await FreelancerProfile.increment('completedProjects', { where: { userId: c.freelancerId } });
      await notify(c.clientId, `"${project.title}" was marked completed`, 'PROJECT');
    }
  }
  return success(res, 'Progress updated', c);
});
