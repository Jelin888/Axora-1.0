const { Review, Project, User, FreelancerProfile, Contract } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { reviewDto } = require('../utils/serializers');
const notify = require('../utils/notify');

const include = [
  { model: Project, as: 'project', attributes: ['id', 'title'] },
  { model: User, as: 'reviewer', attributes: ['id', 'fullName', 'profilePhotoUrl'] },
];

exports.create = asyncHandler(async (req, res) => {
  const { projectId, revieweeId, rating, comment } = req.body;
  if (!projectId || !revieweeId) return error(res, 'Project and reviewee are required');
  if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) return error(res, 'Rating must be between 1 and 5');

  const project = await Project.findByPk(projectId);
  if (!project) return error(res, 'Project not found', 404);
  if (project.status !== 'COMPLETED') return error(res, 'Reviews can only be left on completed projects');

  // The reviewer and reviewee must be the two parties of this project's contract
  const contract = await Contract.findOne({ where: { projectId } });
  const parties = contract ? [contract.clientId, contract.freelancerId] : [];
  if (!parties.includes(req.user.id) || !parties.includes(Number(revieweeId)) || Number(revieweeId) === req.user.id) {
    return error(res, 'You can only review the other party of this project', 403);
  }
  if (await Review.findOne({ where: { projectId, reviewerId: req.user.id } })) return error(res, 'You have already reviewed this project');

  const review = await Review.create({ projectId, reviewerId: req.user.id, revieweeId, rating, comment });

  // Recalculate the freelancer's average rating
  const profile = await FreelancerProfile.findOne({ where: { userId: revieweeId } });
  if (profile) {
    const all = await Review.findAll({ where: { revieweeId } });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    profile.averageRating = Math.round(avg * 10) / 10;
    await profile.save();
  }
  await notify(revieweeId, `You received a ${rating}-star review`, 'REVIEW');
  return success(res, 'Review submitted', reviewDto(await Review.findByPk(review.id, { include })), 201);
});

exports.forProject = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({ where: { projectId: req.params.projectId }, include });
  return success(res, 'OK', reviews.map(reviewDto));
});

exports.forUser = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({ where: { revieweeId: req.params.userId }, include, order: [['createdAt', 'DESC']] });
  return success(res, 'OK', reviews.map(reviewDto));
});
