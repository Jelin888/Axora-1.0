const { Op } = require('sequelize');
const { Project, User, ProjectCategory, Proposal } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { projectDto, page } = require('../utils/serializers');

const include = [
  { model: User, as: 'client', attributes: ['id', 'fullName', 'profilePhotoUrl'] },
  { model: ProjectCategory, as: 'category' },
];

async function withCounts(projects) {
  const ids = projects.map((p) => p.id);
  const counts = ids.length
    ? await Proposal.findAll({ where: { projectId: ids }, attributes: ['projectId', [Proposal.sequelize.fn('COUNT', '*'), 'n']], group: ['projectId'], raw: true })
    : [];
  const map = Object.fromEntries(counts.map((c) => [c.projectId, Number(c.n)]));
  return projects.map((p) => projectDto(p, map[p.id] || 0));
}

const FIELDS = ['title', 'description', 'requiredSkills', 'categoryId', 'budget', 'deadline', 'projectType', 'attachmentUrl'];
const pick = (body) => Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined && body[f] !== '').map((f) => [f, body[f]]));

exports.create = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ROLE_CLIENT') return error(res, 'Only clients can post projects', 403);
  const { title, description, budget } = req.body;
  if (!title || !description || !budget) return error(res, 'Title, description and budget are required');

  const project = await Project.create({ ...pick(req.body), clientId: req.user.id, status: 'OPEN' });
  const fresh = await Project.findByPk(project.id, { include });
  return success(res, 'Project posted successfully', projectDto(fresh, 0), 201);
});

exports.search = asyncHandler(async (req, res) => {
  const { keyword, categoryId, status, projectType, minBudget, maxBudget, skill, sort } = req.query;
  const pageNum = Math.max(parseInt(req.query.page) || 0, 0);
  const size = Math.min(parseInt(req.query.size) || 10, 100);

  const where = {};
  if (keyword) where[Op.or] = [{ title: { [Op.like]: `%${keyword}%` } }, { requiredSkills: { [Op.like]: `%${keyword}%` } }];
  if (skill) where.requiredSkills = { [Op.like]: `%${skill}%` };
  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status.toUpperCase();
  if (projectType) where.projectType = projectType.toUpperCase();
  if (minBudget || maxBudget) {
    where.budget = {};
    if (minBudget) where.budget[Op.gte] = minBudget;
    if (maxBudget) where.budget[Op.lte] = maxBudget;
  }

  const order = sort === 'budget_desc' ? [['budget', 'DESC']] : sort === 'budget_asc' ? [['budget', 'ASC']] : [['createdAt', 'DESC']];
  const { rows, count } = await Project.findAndCountAll({ where, include, order, limit: size, offset: pageNum * size, distinct: true });
  return success(res, 'OK', page(await withCounts(rows), count, pageNum, size));
});

exports.getById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id, { include });
  if (!project) return error(res, 'Project not found', 404);
  return success(res, 'OK', (await withCounts([project]))[0]);
});

exports.update = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return error(res, 'Project not found', 404);
  if (project.clientId !== req.user.id) return error(res, 'You do not own this project', 403);
  await project.update(pick(req.body));
  const fresh = await Project.findByPk(project.id, { include });
  return success(res, 'Project updated', (await withCounts([fresh]))[0]);
});

exports.remove = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return error(res, 'Project not found', 404);
  // Owner or admin may delete
  if (project.clientId !== req.user.id && req.user.role !== 'ROLE_ADMIN') return error(res, 'You do not own this project', 403);
  await project.destroy();
  return success(res, 'Project deleted');
});

exports.withCounts = withCounts;
exports.include = include;
