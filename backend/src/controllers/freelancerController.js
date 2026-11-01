const { Op } = require('sequelize');
const { FreelancerProfile, User, Skill } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { freelancerDto, page } = require('../utils/serializers');

const include = [
  { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'phone', 'profilePhotoUrl', 'status'] },
  { model: Skill, as: 'skills', through: { attributes: [] } },
];

exports.search = asyncHandler(async (req, res) => {
  const { keyword, skill, minRating, minRate, maxRate, available } = req.query;
  const pageNum = Math.max(parseInt(req.query.page) || 0, 0);
  const size = Math.min(parseInt(req.query.size) || 12, 50);

  const where = {};
  if (minRating) where.averageRating = { [Op.gte]: parseFloat(minRating) };
  if (minRate || maxRate) {
    where.hourlyRate = {};
    if (minRate) where.hourlyRate[Op.gte] = minRate;
    if (maxRate) where.hourlyRate[Op.lte] = maxRate;
  }
  if (available === 'true') where.available = true;

  const userWhere = { status: 'ACTIVE' };
  if (keyword) {
    where[Op.or] = [
      { professionalTitle: { [Op.like]: `%${keyword}%` } },
      { '$user.full_name$': { [Op.like]: `%${keyword}%` } },
    ];
  }

  const skillInclude = skill
    ? { model: Skill, as: 'skills', through: { attributes: [] }, where: { name: { [Op.like]: `%${skill}%` } } }
    : include[1];

  const { rows, count } = await FreelancerProfile.findAndCountAll({
    where,
    include: [{ ...include[0], where: userWhere }, skillInclude],
    limit: size, offset: pageNum * size, distinct: true, subQuery: false,
    order: [['averageRating', 'DESC']],
  });
  return success(res, 'OK', page(rows.map(freelancerDto), count, pageNum, size));
});

exports.getById = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findByPk(req.params.id, { include });
  if (!profile) return error(res, 'Freelancer profile not found', 404);
  return success(res, 'OK', freelancerDto(profile));
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await FreelancerProfile.findOne({ where: { userId: req.user.id } });
  if (!profile) return error(res, 'Freelancer profile not found', 404);

  const fields = ['professionalTitle', 'bio', 'location', 'experienceYears', 'hourlyRate', 'available', 'linkedinUrl', 'githubUrl', 'websiteUrl'];
  fields.forEach((f) => { if (req.body[f] !== undefined) profile[f] = req.body[f]; });
  await profile.save();

  if (Array.isArray(req.body.skills)) {
    const skills = [];
    for (const name of req.body.skills) {
      const [skill] = await Skill.findOrCreate({ where: { name } });
      skills.push(skill);
    }
    await profile.setSkills(skills);
  }

  const fresh = await FreelancerProfile.findByPk(profile.id, { include });
  return success(res, 'Profile updated', freelancerDto(fresh));
});
