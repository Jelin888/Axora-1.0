const { Notification } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { notificationDto } = require('../utils/serializers');

exports.list = asyncHandler(async (req, res) => {
  const items = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit: 100 });
  return success(res, 'OK', items.map(notificationDto));
});

exports.markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findByPk(req.params.id);
  if (!n) return error(res, 'Notification not found', 404);
  if (n.userId !== req.user.id) return error(res, 'Not your notification', 403);
  n.isRead = true;
  await n.save();
  return success(res, 'Marked as read');
});
