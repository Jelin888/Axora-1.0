const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { upload, avatarUpload } = require('../middleware/upload');

const auth = require('../controllers/authController');
const users = require('../controllers/userController');
const freelancers = require('../controllers/freelancerController');
const portfolio = require('../controllers/portfolioController');
const projects = require('../controllers/projectController');
const proposals = require('../controllers/proposalController');
const messages = require('../controllers/messageController');
const payments = require('../controllers/paymentController');
const reviews = require('../controllers/reviewController');
const notifications = require('../controllers/notificationController');
const offers = require('../controllers/offerController');
const lookup = require('../controllers/lookupController');
const contracts = require('../controllers/contractController');
const admin = require('../controllers/adminController');

const router = express.Router();
const ADMIN = [authenticate, authorize('ROLE_ADMIN')];

// ---- Auth (public) ----
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// ---- Users ----
router.get('/users/me', authenticate, users.me);
router.put('/users/me', authenticate, users.updateMe);
router.post('/users/me/photo', authenticate, avatarUpload.single('photo'), users.uploadPhoto);
router.delete('/users/me/photo', authenticate, users.removePhoto);
router.get('/users/:id', users.getById);
router.get('/users/:userId/reviews', reviews.forUser);

// ---- Freelancers ----
router.get('/freelancers', freelancers.search);
router.get('/freelancers/:id', freelancers.getById);
router.put('/freelancers/profile', authenticate, authorize('ROLE_FREELANCER'), freelancers.updateMyProfile);

// ---- Portfolio ----
router.get('/portfolio/my', authenticate, authorize('ROLE_FREELANCER'), portfolio.my);
router.get('/portfolio/freelancer/:freelancerId', portfolio.byFreelancer);
router.post('/portfolio', authenticate, authorize('ROLE_FREELANCER'), portfolio.create);
router.put('/portfolio/:id', authenticate, authorize('ROLE_FREELANCER'), portfolio.update);
router.delete('/portfolio/:id', authenticate, authorize('ROLE_FREELANCER'), portfolio.remove);

// ---- Projects ----
router.get('/projects', projects.search);
router.get('/projects/:id', projects.getById);
router.post('/projects', authenticate, authorize('ROLE_CLIENT'), projects.create);
router.put('/projects/:id', authenticate, authorize('ROLE_CLIENT'), projects.update);
router.delete('/projects/:id', authenticate, authorize('ROLE_CLIENT', 'ROLE_ADMIN'), projects.remove);

// ---- Proposals ----
router.post('/projects/:projectId/proposals', authenticate, authorize('ROLE_FREELANCER'), proposals.submit);
router.get('/projects/:projectId/proposals', authenticate, proposals.byProject);
router.get('/proposals/my', authenticate, authorize('ROLE_FREELANCER'), proposals.my);
router.put('/proposals/:id/accept', authenticate, authorize('ROLE_CLIENT'), proposals.accept);
router.put('/proposals/:id/reject', authenticate, authorize('ROLE_CLIENT'), proposals.reject);
router.put('/proposals/:id/withdraw', authenticate, authorize('ROLE_FREELANCER'), proposals.withdraw);

// ---- Contracts / workspace / milestones ----
router.get('/contracts/my', authenticate, contracts.my);
router.get('/contracts/project/:projectId', authenticate, contracts.byProject);
router.post('/contracts/:id/milestones', authenticate, authorize('ROLE_CLIENT'), contracts.addMilestone);
router.put('/contracts/:id/progress', authenticate, authorize('ROLE_FREELANCER'), contracts.updateProgress);
router.put('/milestones/:id/status', authenticate, contracts.updateMilestone);

// ---- Messenger ----
router.get('/conversations', authenticate, messages.list);
router.post('/conversations', authenticate, messages.createOrGet);
router.get('/conversations/:id/messages', authenticate, messages.messages);
router.post('/conversations/:id/messages', authenticate, messages.send);
router.post('/conversations/:id/attachments', authenticate, upload.single('file'), messages.upload);

// ---- Payments ----
router.post('/payments/create', authenticate, authorize('ROLE_CLIENT'), payments.create);
router.get('/payments/my', authenticate, payments.my);
router.get('/payments/:id', authenticate, payments.getById);
router.put('/payments/:id/mark-success', authenticate, payments.markSuccess);

// ---- Reviews ----
router.post('/reviews', authenticate, reviews.create);
router.get('/projects/:projectId/reviews', reviews.forProject);

// ---- Notifications ----
router.get('/notifications', authenticate, notifications.list);
router.put('/notifications/:id/read', authenticate, notifications.markRead);

// ---- Offers & announcements ----
router.get('/offers', offers.active);
router.get('/announcements', offers.announcements);
router.get('/admin/offers', ...ADMIN, offers.all);
router.post('/admin/offers', ...ADMIN, offers.create);
router.put('/admin/offers/:id', ...ADMIN, offers.update);
router.delete('/admin/offers/:id', ...ADMIN, offers.remove);
router.post('/admin/announcements', ...ADMIN, offers.createAnnouncement);

// ---- Lookups ----
router.get('/categories', lookup.categories);
router.get('/skills', lookup.skills);

// ---- Admin ----
router.get('/admin/dashboard', ...ADMIN, admin.dashboard);
router.get('/admin/reports', ...ADMIN, admin.reports);
router.get('/admin/users', ...ADMIN, admin.users);
router.put('/admin/users/:id/status', ...ADMIN, admin.updateUserStatus);
router.delete('/admin/users/:id', ...ADMIN, admin.deleteUser);
router.get('/admin/projects', ...ADMIN, admin.projects);
router.put('/admin/projects/:id/status', ...ADMIN, admin.updateProjectStatus);
router.delete('/admin/projects/:id', ...ADMIN, admin.deleteProject);
router.get('/admin/proposals', ...ADMIN, admin.proposals);
router.get('/admin/payments', ...ADMIN, admin.payments);

module.exports = router;
