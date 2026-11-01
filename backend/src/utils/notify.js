const { Notification } = require('../models');

async function notify(userId, message, type) {
  await Notification.create({ userId, message, type, isRead: false });
}

module.exports = notify;
