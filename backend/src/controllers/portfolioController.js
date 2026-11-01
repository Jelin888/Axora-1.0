const { PortfolioProject } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { portfolioDto } = require('../utils/serializers');

const FIELDS = ['title', 'description', 'technologies', 'imageUrl', 'githubUrl', 'liveDemoUrl', 'completionDate', 'category'];
const pick = (body) => Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined && body[f] !== '').map((f) => [f, body[f]]));

exports.my = asyncHandler(async (req, res) => {
  const items = await PortfolioProject.findAll({ where: { freelancerId: req.user.id }, order: [['createdAt', 'DESC']] });
  return success(res, 'OK', items.map(portfolioDto));
});

exports.byFreelancer = asyncHandler(async (req, res) => {
  const items = await PortfolioProject.findAll({ where: { freelancerId: req.params.freelancerId }, order: [['createdAt', 'DESC']] });
  return success(res, 'OK', items.map(portfolioDto));
});

exports.create = asyncHandler(async (req, res) => {
  if (!req.body.title) return error(res, 'Title is required');
  const item = await PortfolioProject.create({ ...pick(req.body), freelancerId: req.user.id });
  return success(res, 'Portfolio project added', portfolioDto(item), 201);
});

exports.update = asyncHandler(async (req, res) => {
  const item = await PortfolioProject.findByPk(req.params.id);
  if (!item) return error(res, 'Portfolio project not found', 404);
  if (item.freelancerId !== req.user.id) return error(res, 'You do not own this portfolio project', 403);
  await item.update(pick(req.body));
  return success(res, 'Portfolio project updated', portfolioDto(item));
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await PortfolioProject.findByPk(req.params.id);
  if (!item) return error(res, 'Portfolio project not found', 404);
  if (item.freelancerId !== req.user.id) return error(res, 'You do not own this portfolio project', 403);
  await item.destroy();
  return success(res, 'Portfolio project deleted');
});
