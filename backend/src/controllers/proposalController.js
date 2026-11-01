const { Proposal, Project, User, Contract } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { proposalDto } = require('../utils/serializers');
const notify = require('../utils/notify');

const include = [
  { model: Project, as: 'project', attributes: ['id', 'title', 'clientId', 'status'] },
  { model: User, as: 'freelancer', attributes: ['id', 'fullName', 'profilePhotoUrl'] },
];

exports.submit = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ROLE_FREELANCER') return error(res, 'Only freelancers can submit proposals', 403);
  const project = await Project.findByPk(req.params.projectId);
  if (!project) return error(res, 'Project not found', 404);
  if (project.status !== 'OPEN') return error(res, 'This project is no longer open for proposals');

  const { coverLetter, proposedAmount, estimatedDeliveryDays } = req.body;
  if (!coverLetter || !proposedAmount) return error(res, 'Cover letter and proposed amount are required');

  const exists = await Proposal.findOne({ where: { projectId: project.id, freelancerId: req.user.id } });
  if (exists) return error(res, 'You have already submitted a proposal for this project');

  const proposal = await Proposal.create({
    projectId: project.id, freelancerId: req.user.id, coverLetter, proposedAmount,
    estimatedDeliveryDays: estimatedDeliveryDays || null, status: 'PENDING',
  });
  await notify(project.clientId, `New proposal received for "${project.title}"`, 'PROPOSAL');

  const fresh = await Proposal.findByPk(proposal.id, { include });
  return success(res, 'Proposal submitted successfully', proposalDto(fresh), 201);
});

// Only the project's owner (or an admin) may see the proposals for a project.
exports.byProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.projectId);
  if (!project) return error(res, 'Project not found', 404);
  if (project.clientId !== req.user.id && req.user.role !== 'ROLE_ADMIN') return error(res, 'You do not own this project', 403);
  const proposals = await Proposal.findAll({ where: { projectId: project.id }, include, order: [['createdAt', 'DESC']] });
  return success(res, 'OK', proposals.map(proposalDto));
});

exports.my = asyncHandler(async (req, res) => {
  const proposals = await Proposal.findAll({ where: { freelancerId: req.user.id }, include, order: [['createdAt', 'DESC']] });
  return success(res, 'OK', proposals.map(proposalDto));
});

exports.accept = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findByPk(req.params.id, { include });
  if (!proposal) return error(res, 'Proposal not found', 404);
  const project = await Project.findByPk(proposal.projectId);
  if (project.clientId !== req.user.id) return error(res, 'You do not own this project', 403);
  if (project.status !== 'OPEN') return error(res, 'This project already has an accepted proposal');

  proposal.status = 'ACCEPTED';
  project.status = 'IN_PROGRESS';
  await proposal.save();
  await project.save();
  await Contract.findOrCreate({
    where: { projectId: project.id },
    defaults: { clientId: project.clientId, freelancerId: proposal.freelancerId, progressPercent: 0 },
  });

  // Other pending proposals for this project are rejected automatically
  const others = await Proposal.findAll({ where: { projectId: project.id, status: 'PENDING' } });
  for (const o of others) {
    o.status = 'REJECTED';
    await o.save();
    await notify(o.freelancerId, `Your proposal for "${project.title}" was not selected`, 'PROPOSAL_REJECTED');
  }
  await notify(proposal.freelancerId, `Your proposal for "${project.title}" was accepted!`, 'PROPOSAL_ACCEPTED');
  return success(res, 'Proposal accepted', proposalDto(proposal));
});

exports.reject = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findByPk(req.params.id, { include });
  if (!proposal) return error(res, 'Proposal not found', 404);
  const project = await Project.findByPk(proposal.projectId);
  if (project.clientId !== req.user.id) return error(res, 'You do not own this project', 403);
  proposal.status = 'REJECTED';
  await proposal.save();
  await notify(proposal.freelancerId, `Your proposal for "${project.title}" was rejected`, 'PROPOSAL_REJECTED');
  return success(res, 'Proposal rejected', proposalDto(proposal));
});

exports.withdraw = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findByPk(req.params.id, { include });
  if (!proposal) return error(res, 'Proposal not found', 404);
  if (proposal.freelancerId !== req.user.id) return error(res, 'This is not your proposal', 403);
  if (proposal.status !== 'PENDING') return error(res, 'Only pending proposals can be withdrawn');
  proposal.status = 'WITHDRAWN';
  await proposal.save();
  return success(res, 'Proposal withdrawn', proposalDto(proposal));
});
