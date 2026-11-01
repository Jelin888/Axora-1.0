const { Op, fn, col, literal } = require('sequelize');
const { sequelize, User, Project, Proposal, Payment, Offer, ProjectCategory } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { userDto, projectDto, proposalDto, paymentDto, page } = require('../utils/serializers');
const { include: projectInclude, withCounts } = require('./projectController');

const paging = (req, def = 10) => ({
  pageNum: Math.max(parseInt(req.query.page) || 0, 0),
  size: Math.min(parseInt(req.query.size) || def, 200),
});

exports.dashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalFreelancers, totalClients, totalProjects, activeProjects, completedProjects,
    totalProposals, totalTransactions, revenue, activeOffers] = await Promise.all([
    User.count(),
    User.count({ where: { role: 'ROLE_FREELANCER' } }),
    User.count({ where: { role: 'ROLE_CLIENT' } }),
    Project.count(),
    Project.count({ where: { status: ['OPEN', 'IN_PROGRESS'] } }),
    Project.count({ where: { status: 'COMPLETED' } }),
    Proposal.count(),
    Payment.count(),
    Payment.sum('amount', { where: { status: 'SUCCESS' } }),
    Offer.count({ where: { status: 'ACTIVE' } }),
  ]);
  return success(res, 'OK', {
    totalUsers, totalFreelancers, totalClients, totalProjects, activeProjects, completedProjects,
    totalProposals, totalTransactions, totalRevenue: Number(revenue || 0), activeOffers,
  });
});

exports.users = asyncHandler(async (req, res) => {
  const { keyword, role, status } = req.query;
  const { pageNum, size } = paging(req);
  const where = {};
  if (keyword) where[Op.or] = [{ fullName: { [Op.like]: `%${keyword}%` } }, { email: { [Op.like]: `%${keyword}%` } }];
  if (role) where.role = `ROLE_${role.toUpperCase().replace('ROLE_', '')}`;
  if (status) where.status = status.toUpperCase();
  const { rows, count } = await User.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: size, offset: pageNum * size });
  return success(res, 'OK', page(rows.map(userDto), count, pageNum, size));
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return error(res, 'User not found', 404);
  if (user.id === req.user.id) return error(res, 'You cannot change your own status');
  if (!['ACTIVE', 'SUSPENDED'].includes(req.body.status)) return error(res, 'Status must be ACTIVE or SUSPENDED');
  user.status = req.body.status;
  await user.save();
  return success(res, 'User status updated', userDto(user));
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return error(res, 'User not found', 404);
  if (user.role === 'ROLE_ADMIN') return error(res, 'Admin accounts cannot be deleted', 403);
  if (user.profilePhotoUrl) {
    const { deleteAvatarFile } = require('../middleware/upload');
    deleteAvatarFile(user.profilePhotoUrl);
  }
  await user.destroy();
  return success(res, 'User deleted');
});

exports.projects = asyncHandler(async (req, res) => {
  const { keyword, status } = req.query;
  const { pageNum, size } = paging(req);
  const where = {};
  if (keyword) where.title = { [Op.like]: `%${keyword}%` };
  if (status) where.status = status.toUpperCase();
  const { rows, count } = await Project.findAndCountAll({ where, include: projectInclude, order: [['createdAt', 'DESC']], limit: size, offset: pageNum * size, distinct: true });
  return success(res, 'OK', page(await withCounts(rows), count, pageNum, size));
});

exports.updateProjectStatus = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return error(res, 'Project not found', 404);
  if (!['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(req.body.status)) return error(res, 'Invalid status');
  project.status = req.body.status;
  await project.save();
  return success(res, 'Project status updated', { id: project.id, status: project.status });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return error(res, 'Project not found', 404);
  await project.destroy();
  return success(res, 'Project removed');
});

exports.proposals = asyncHandler(async (req, res) => {
  const { pageNum, size } = paging(req, 20);
  const where = req.query.status ? { status: req.query.status.toUpperCase() } : {};
  const { rows, count } = await Proposal.findAndCountAll({
    where, order: [['createdAt', 'DESC']], limit: size, offset: pageNum * size,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'title'], include: [{ model: User, as: 'client', attributes: ['fullName'] }] },
      { model: User, as: 'freelancer', attributes: ['id', 'fullName'] },
    ],
  });
  const content = rows.map((p) => ({ ...proposalDto(p), clientName: p.project?.client?.fullName }));
  return success(res, 'OK', page(content, count, pageNum, size));
});

exports.payments = asyncHandler(async (req, res) => {
  const { pageNum, size } = paging(req, 20);
  const where = req.query.status ? { status: req.query.status.toUpperCase() } : {};
  const { rows, count } = await Payment.findAndCountAll({
    where, order: [['createdAt', 'DESC']], limit: size, offset: pageNum * size,
    include: [
      { model: Project, as: 'project', attributes: ['id', 'title'] },
      { model: User, as: 'payer', attributes: ['id', 'fullName'] },
      { model: User, as: 'receiver', attributes: ['id', 'fullName'] },
    ],
  });
  return success(res, 'OK', page(rows.map(paymentDto), count, pageNum, size));
});

// Monthly series for the Reports page charts
exports.reports = asyncHandler(async (req, res) => {
  const monthly = async (table, extra = '', agg = 'COUNT(*)') => {
    const [rows] = await sequelize.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, ${agg} AS value FROM ${table}
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH) ${extra} GROUP BY month ORDER BY month`);
    return rows.map((r) => ({ month: r.month, value: Number(r.value) }));
  };
  return success(res, 'OK', {
    usersPerMonth: await monthly('users'),
    freelancersPerMonth: await monthly('users', "AND role = 'ROLE_FREELANCER'"),
    clientsPerMonth: await monthly('users', "AND role = 'ROLE_CLIENT'"),
    projectsPerMonth: await monthly('projects'),
    completedPerMonth: await monthly('projects', "AND status = 'COMPLETED'"),
    proposalsPerMonth: await monthly('proposals'),
    revenuePerMonth: await monthly('payments', "AND status = 'SUCCESS'", 'COALESCE(SUM(amount),0)'),
  });
});
