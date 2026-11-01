const path = require('path');
const { Conversation, ConversationMember, Message, MessageAttachment, User, Project } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { messageDto } = require('../utils/serializers');
const notify = require('../utils/notify');

async function isMember(conversationId, userId) {
  return !!(await ConversationMember.findOne({ where: { conversationId, userId } }));
}

async function conversationDto(conv) {
  const members = await ConversationMember.findAll({
    where: { conversationId: conv.id },
    include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'profilePhotoUrl', 'role'] }],
  });
  const last = await Message.findOne({
    where: { conversationId: conv.id }, order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'sender', attributes: ['id', 'fullName'] }],
  });
  return {
    id: conv.id,
    relatedProjectId: conv.relatedProjectId,
    members: members.map((m) => ({ id: m.user.id, fullName: m.user.fullName, profilePhotoUrl: m.user.profilePhotoUrl, role: m.user.role })),
    lastMessage: last ? messageDto(last) : null,
  };
}

exports.list = asyncHandler(async (req, res) => {
  const memberships = await ConversationMember.findAll({ where: { userId: req.user.id } });
  const convs = await Conversation.findAll({ where: { id: memberships.map((m) => m.conversationId) }, order: [['updatedAt', 'DESC']] });
  return success(res, 'OK', await Promise.all(convs.map(conversationDto)));
});

// Create a 1:1 conversation, or return the existing one between the same two users
exports.createOrGet = asyncHandler(async (req, res) => {
  const { otherUserId, relatedProjectId } = req.body;
  if (!otherUserId || Number(otherUserId) === req.user.id) return error(res, 'A valid other user is required');
  const other = await User.findByPk(otherUserId);
  if (!other) return error(res, 'User not found', 404);

  const mine = await ConversationMember.findAll({ where: { userId: req.user.id } });
  for (const m of mine) {
    const members = await ConversationMember.findAll({ where: { conversationId: m.conversationId } });
    if (members.length === 2 && members.some((x) => x.userId === other.id)) {
      return success(res, 'Conversation ready', await conversationDto(await Conversation.findByPk(m.conversationId)));
    }
  }

  let projectId = null;
  if (relatedProjectId && (await Project.findByPk(relatedProjectId))) projectId = relatedProjectId;
  const conv = await Conversation.create({ relatedProjectId: projectId });
  await ConversationMember.bulkCreate([
    { conversationId: conv.id, userId: req.user.id },
    { conversationId: conv.id, userId: other.id },
  ]);
  return success(res, 'Conversation ready', await conversationDto(conv), 201);
});

exports.messages = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!(await isMember(id, req.user.id))) return error(res, 'You are not part of this conversation', 403);

  // Anything sent by the other person is now delivered/read
  await Message.update({ status: 'READ' }, { where: { conversationId: id, senderId: { [require('sequelize').Op.ne]: req.user.id }, status: ['SENT', 'DELIVERED'] } });

  const msgs = await Message.findAll({
    where: { conversationId: id }, order: [['createdAt', 'ASC']],
    include: [{ model: User, as: 'sender', attributes: ['id', 'fullName'] }, { model: MessageAttachment, as: 'attachments' }],
  });
  return success(res, 'OK', msgs.map((m) => ({
    ...messageDto(m),
    attachments: (m.attachments || []).map((a) => ({ id: a.id, fileName: a.fileName, fileUrl: a.fileUrl, fileType: a.fileType })),
  })));
});

exports.send = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!(await isMember(id, req.user.id))) return error(res, 'You are not part of this conversation', 403);
  const content = (req.body.content || '').trim();
  if (!content) return error(res, 'Message content is required');

  const msg = await Message.create({ conversationId: id, senderId: req.user.id, content, status: 'SENT' });
  await Conversation.update({ updatedAt: new Date() }, { where: { id } });

  const others = await ConversationMember.findAll({ where: { conversationId: id } });
  for (const o of others.filter((m) => m.userId !== req.user.id)) {
    await notify(o.userId, `${req.user.fullName} sent you a message`, 'MESSAGE');
  }
  const fresh = await Message.findByPk(msg.id, { include: [{ model: User, as: 'sender', attributes: ['id', 'fullName'] }] });
  return success(res, 'Message sent', messageDto(fresh), 201);
});

// File sharing inside a conversation (multer has already validated type/size)
exports.upload = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!(await isMember(id, req.user.id))) return error(res, 'You are not part of this conversation', 403);
  if (!req.file) return error(res, 'No file uploaded');

  const msg = await Message.create({ conversationId: id, senderId: req.user.id, content: `📎 ${req.file.originalname}`, status: 'SENT' });
  await MessageAttachment.create({
    messageId: msg.id, fileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`, fileType: path.extname(req.file.originalname).slice(1).toLowerCase(),
  });
  return success(res, 'File shared', { messageId: msg.id, fileUrl: `/uploads/${req.file.filename}` }, 201);
});
