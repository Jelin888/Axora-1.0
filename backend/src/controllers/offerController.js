const { Op } = require('sequelize');
const { Offer, Announcement } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { offerDto } = require('../utils/serializers');

const FIELDS = ['title', 'description', 'imageUrl', 'startDate', 'endDate', 'status'];
const pick = (b) => Object.fromEntries(FIELDS.filter((f) => b[f] !== undefined && b[f] !== '').map((f) => [f, b[f]]));

// Public: only ACTIVE offers inside their date window
exports.active = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const offers = await Offer.findAll({
    where: {
      status: 'ACTIVE',
      [Op.and]: [
        { [Op.or]: [{ startDate: null }, { startDate: { [Op.lte]: today } }] },
        { [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: today } }] },
      ],
    },
  });
  return success(res, 'OK', offers.map(offerDto));
});

exports.all = asyncHandler(async (req, res) => success(res, 'OK', (await Offer.findAll({ order: [['createdAt', 'DESC']] })).map(offerDto)));

exports.create = asyncHandler(async (req, res) => {
  if (!req.body.title) return error(res, 'Title is required');
  return success(res, 'Offer created', offerDto(await Offer.create(pick(req.body))), 201);
});

exports.update = asyncHandler(async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return error(res, 'Offer not found', 404);
  await offer.update(pick(req.body));
  return success(res, 'Offer updated', offerDto(offer));
});

exports.remove = asyncHandler(async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return error(res, 'Offer not found', 404);
  await offer.destroy();
  return success(res, 'Offer deleted');
});

// ---- Announcements ----
exports.announcements = asyncHandler(async (req, res) =>
  success(res, 'OK', await Announcement.findAll({ where: { active: true }, order: [['createdAt', 'DESC']] })));

exports.createAnnouncement = asyncHandler(async (req, res) => {
  if (!req.body.title) return error(res, 'Title is required');
  const { title, description, imageUrl, active } = req.body;
  return success(res, 'Announcement published', await Announcement.create({ title, description, imageUrl, active }), 201);
});
