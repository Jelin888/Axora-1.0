// Turns Sequelize records into the exact JSON shapes the React frontend expects
// (same field names the Spring Boot DTOs used), so the frontend needs no changes.

const num = (v) => (v === null || v === undefined ? v : Number(v));

const userDto = (u) => ({
  id: u.id, fullName: u.fullName, email: u.email, role: u.role, status: u.status,
  profilePhotoUrl: u.profilePhotoUrl, phone: u.phone, createdAt: u.createdAt,
});

const freelancerDto = (p) => ({
  id: p.id,
  userId: p.userId,
  fullName: p.user?.fullName,
  profilePhotoUrl: p.user?.profilePhotoUrl,
  email: p.user?.email,
  phone: p.user?.phone,
  professionalTitle: p.professionalTitle,
  bio: p.bio,
  location: p.location,
  experienceYears: p.experienceYears,
  hourlyRate: num(p.hourlyRate),
  available: p.available,
  linkedinUrl: p.linkedinUrl,
  githubUrl: p.githubUrl,
  websiteUrl: p.websiteUrl,
  averageRating: p.averageRating,
  completedProjects: p.completedProjects,
  skills: (p.skills || []).map((s) => s.name),
});

const projectDto = (p, proposalCount = 0) => ({
  id: p.id,
  clientId: p.clientId,
  clientName: p.client?.fullName,
  clientProfilePhotoUrl: p.client?.profilePhotoUrl,
  title: p.title,
  description: p.description,
  requiredSkills: p.requiredSkills,
  category: p.category?.name || null,
  budget: num(p.budget),
  deadline: p.deadline,
  projectType: p.projectType,
  status: p.status,
  attachmentUrl: p.attachmentUrl,
  proposalCount,
  createdAt: p.createdAt,
});

const proposalDto = (p) => ({
  id: p.id,
  projectId: p.projectId,
  projectTitle: p.project?.title,
  freelancerId: p.freelancerId,
  freelancerName: p.freelancer?.fullName,
  freelancerProfilePhotoUrl: p.freelancer?.profilePhotoUrl,
  coverLetter: p.coverLetter,
  proposedAmount: num(p.proposedAmount),
  estimatedDeliveryDays: p.estimatedDeliveryDays,
  status: p.status,
  createdAt: p.createdAt,
});

const messageDto = (m) => ({
  id: m.id, conversationId: m.conversationId, senderId: m.senderId,
  senderName: m.sender?.fullName, senderProfilePhotoUrl: m.sender?.profilePhotoUrl,
  content: m.content, status: m.status, createdAt: m.createdAt,
});

const paymentDto = (p) => {
  const amount = num(p.amount);
  const note = encodeURIComponent(`AXORA Payment - ${p.project?.title || ''}`);
  return {
    id: p.id,
    transactionId: p.transactionId,
    projectId: p.projectId,
    projectTitle: p.project?.title,
    payerName: p.payer?.fullName,
    receiverName: p.receiver?.fullName,
    amount,
    status: p.status,
    // Safe UPI deep-link — no banking credentials are ever stored
    upiIntentUrl: `upi://pay?pa=${process.env.UPI_ID || 'axora@upi'}&pn=AXORA&am=${amount}&cu=INR&tn=${note}`,
    createdAt: p.createdAt,
  };
};

const reviewDto = (r) => ({
  id: r.id, projectId: r.projectId, projectTitle: r.project?.title,
  reviewerId: r.reviewerId, reviewerName: r.reviewer?.fullName,
  reviewerProfilePhotoUrl: r.reviewer?.profilePhotoUrl,
  revieweeId: r.revieweeId,
  rating: r.rating, comment: r.comment, createdAt: r.createdAt,
});

const notificationDto = (n) => ({
  id: n.id, message: n.message, type: n.type, isRead: n.isRead, createdAt: n.createdAt,
});

const offerDto = (o) => ({
  id: o.id, title: o.title, description: o.description, imageUrl: o.imageUrl,
  startDate: o.startDate, endDate: o.endDate, status: o.status,
});

const portfolioDto = (p) => ({
  id: p.id, title: p.title, description: p.description, technologies: p.technologies,
  imageUrl: p.imageUrl, githubUrl: p.githubUrl, liveDemoUrl: p.liveDemoUrl,
  completionDate: p.completionDate, category: p.category,
});

// Spring-style page object the frontend already reads: { content, totalPages, ... }
const page = (rows, count, pageNum, size) => ({
  content: rows, totalElements: count, totalPages: Math.ceil(count / size), number: pageNum, size,
});

module.exports = {
  userDto, freelancerDto, projectDto, proposalDto, messageDto, paymentDto,
  reviewDto, notificationDto, offerDto, portfolioDto, page,
};
