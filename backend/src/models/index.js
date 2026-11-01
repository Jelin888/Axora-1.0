const sequelize = require('../config/db');

const User = require('./User');
const FreelancerProfile = require('./FreelancerProfile');
const ClientProfile = require('./ClientProfile');
const Skill = require('./Skill');
const ProjectCategory = require('./ProjectCategory');
const PortfolioProject = require('./PortfolioProject');
const Project = require('./Project');
const Proposal = require('./Proposal');
const Contract = require('./Contract');
const Milestone = require('./Milestone');
const Conversation = require('./Conversation');
const ConversationMember = require('./ConversationMember');
const Message = require('./Message');
const MessageAttachment = require('./MessageAttachment');
const Payment = require('./Payment');
const Review = require('./Review');
const Notification = require('./Notification');
const Offer = require('./Offer');
const Announcement = require('./Announcement');

// ---- User <-> Profiles (1:1) ----
User.hasOne(FreelancerProfile, { foreignKey: 'userId', as: 'freelancerProfile' });
FreelancerProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(ClientProfile, { foreignKey: 'userId', as: 'clientProfile' });
ClientProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ---- Freelancer <-> Skills (N:N) ----
const FreelancerSkill = sequelize.define('FreelancerSkill', {}, { tableName: 'freelancer_skills', timestamps: false });
FreelancerProfile.belongsToMany(Skill, { through: FreelancerSkill, foreignKey: 'freelancer_id', otherKey: 'skill_id', as: 'skills' });
Skill.belongsToMany(FreelancerProfile, { through: FreelancerSkill, foreignKey: 'skill_id', otherKey: 'freelancer_id', as: 'freelancers' });

// ---- Portfolio (freelancer = User) ----
User.hasMany(PortfolioProject, { foreignKey: 'freelancerId', as: 'portfolioProjects' });
PortfolioProject.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

// ---- Projects ----
User.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

ProjectCategory.hasMany(Project, { foreignKey: 'categoryId', as: 'projects' });
Project.belongsTo(ProjectCategory, { foreignKey: 'categoryId', as: 'category' });

// ---- Proposals ----
Project.hasMany(Proposal, { foreignKey: 'projectId', as: 'proposals' });
Proposal.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Proposal, { foreignKey: 'freelancerId', as: 'proposals' });
Proposal.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

// ---- Contract ----
Project.hasOne(Contract, { foreignKey: 'projectId', as: 'contract' });
Contract.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Contract.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Contract.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

// ---- Milestones ----
Contract.hasMany(Milestone, { foreignKey: 'contractId', as: 'milestones' });
Milestone.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

// ---- Conversations / Members / Messages ----
Project.hasMany(Conversation, { foreignKey: 'relatedProjectId', as: 'conversations' });
Conversation.belongsTo(Project, { foreignKey: 'relatedProjectId', as: 'relatedProject' });

Conversation.hasMany(ConversationMember, { foreignKey: 'conversationId', as: 'members' });
ConversationMember.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
ConversationMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Message.hasMany(MessageAttachment, { foreignKey: 'messageId', as: 'attachments' });
MessageAttachment.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

// ---- Payments ----
Project.hasMany(Payment, { foreignKey: 'projectId', as: 'payments' });
Payment.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Payment.belongsTo(Milestone, { foreignKey: 'milestoneId', as: 'milestone' });
Payment.belongsTo(User, { foreignKey: 'payerId', as: 'payer' });
Payment.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// ---- Reviews ----
Project.hasMany(Review, { foreignKey: 'projectId', as: 'reviews' });
Review.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

// ---- Notifications ----
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  FreelancerProfile,
  ClientProfile,
  Skill,
  ProjectCategory,
  PortfolioProject,
  Project,
  Proposal,
  Contract,
  Milestone,
  Conversation,
  ConversationMember,
  Message,
  MessageAttachment,
  Payment,
  Review,
  Notification,
  Offer,
  Announcement,
};
