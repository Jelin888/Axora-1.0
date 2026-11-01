/**
 * Demo data for AXORA — LOCAL DEVELOPMENT / DEMO ONLY.
 * Runs automatically on first start when the users table is empty,
 * or manually with: npm run seed
 */
const bcrypt = require('bcryptjs');
const M = require('../models');

const daysFromNow = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

async function seedIfEmpty() {
  if ((await M.User.count()) > 0) return false;
  console.log('=== AXORA: seeding demo data (local development only) ===');
  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Categories & skills
  const categories = await M.ProjectCategory.bulkCreate(
    ['Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science', 'AI/ML', 'Cloud', 'Cybersecurity', 'Digital Marketing', 'Content Writing']
      .map((name) => ({ name })));
  const skillNames = ['Java', 'Spring Boot', 'React', 'MySQL', 'JavaScript', 'Node.js', 'Python', 'Figma', 'AWS', 'Docker', 'TypeScript', 'Flutter', 'Machine Learning', 'SEO'];
  const skills = Object.fromEntries((await M.Skill.bulkCreate(skillNames.map((name) => ({ name })))).map((s) => [s.name, s]));

  // Admin
  await M.User.create({ fullName: 'AXORA Admin', email: 'jelinjelin888@gmail.com', password: hash('Jelin@_@888'), role: 'ROLE_ADMIN' });

  // Freelancers
  const fl = [
    ['John Doe', 'john@axora.com', 'Full Stack Developer', 'Bengaluru', 5, 800, 4.8, 12, ['React', 'Node.js', 'MySQL', 'JavaScript']],
    ['Priya Sharma', 'priya@axora.com', 'UI/UX Designer', 'Mumbai', 4, 600, 4.7, 9, ['Figma', 'React']],
    ['Arjun Mehta', 'arjun@axora.com', 'Java Spring Boot Developer', 'Pune', 6, 900, 4.9, 15, ['Java', 'Spring Boot', 'MySQL', 'Docker']],
    ['Sara Khan', 'sara@axora.com', 'Mobile App Developer', 'Delhi', 3, 700, 4.5, 6, ['Flutter', 'JavaScript', 'TypeScript']],
    ['Rahul Verma', 'rahul@axora.com', 'Data Scientist', 'Hyderabad', 4, 1000, 4.6, 8, ['Python', 'Machine Learning', 'AWS']],
  ];
  const freelancers = [];
  for (const [fullName, email, title, location, exp, rate, rating, done, sk] of fl) {
    const user = await M.User.create({ fullName, email, password: hash('Freelancer@123'), role: 'ROLE_FREELANCER' });
    const profile = await M.FreelancerProfile.create({
      userId: user.id, professionalTitle: title, location, experienceYears: exp, hourlyRate: rate,
      averageRating: rating, completedProjects: done, available: true,
      bio: `${exp}+ years of experience as a ${title}. I deliver clean, well-tested work and communicate clearly.`,
      githubUrl: 'https://github.com',
    });
    await profile.setSkills(sk.map((n) => skills[n]));
    await M.PortfolioProject.bulkCreate([
      { freelancerId: user.id, title: `${title.split(' ')[0]} Dashboard`, description: 'Analytics dashboard with role-based access.', technologies: sk.slice(0, 3).join(', '), category: 'Web Development', completionDate: daysFromNow(-60) },
      { freelancerId: user.id, title: 'Client Booking Platform', description: 'End-to-end booking and payments workflow.', technologies: sk.slice(0, 2).join(', '), category: 'Web Development', completionDate: daysFromNow(-150) },
    ]);
    freelancers.push(user);
  }

  // Clients
  const clients = [];
  for (const [fullName, email, company] of [
    ['TechNova Pvt Ltd', 'client1@axora.com', 'TechNova'], ['BrightRetail Inc', 'client2@axora.com', 'BrightRetail'], ['Skyline Ventures', 'client3@axora.com', 'Skyline'],
  ]) {
    const user = await M.User.create({ fullName, email, password: hash('Client@123'), role: 'ROLE_CLIENT' });
    await M.ClientProfile.create({ userId: user.id, companyName: company, about: 'Growing company hiring great freelance talent.' });
    clients.push(user);
  }

  // Projects (10 open + used below for workflow demos)
  const P = [
    ['Build an E-Commerce Website', 'Full e-commerce platform with cart, checkout and admin panel.', 'React,Node.js,MySQL', 25000, 0, 0],
    ['Portfolio Website for Designer', 'Modern, responsive portfolio site with case studies.', 'React,CSS', 5000, 2, 1],
    ['Food Delivery Mobile App', 'Cross-platform food delivery app with live order tracking.', 'Flutter,Node.js', 40000, 1, 0],
    ['AI Chatbot Integration', 'Integrate an AI support chatbot into an existing site.', 'Python,Machine Learning', 18000, 4, 2],
    ['SaaS Dashboard UI/UX Redesign', 'Redesign dashboard for better usability and accessibility.', 'Figma,UI/UX', 12000, 2, 1],
    ['Cloud Migration to AWS', 'Migrate on-prem servers to AWS with zero downtime.', 'AWS,Docker', 30000, 5, 2],
    ['SEO Blog Content (20 articles)', '20 SEO-optimised blog articles for a fintech blog.', 'SEO,Content Writing', 8000, 8, 1],
    ['Web Application Security Audit', 'Full security audit and penetration report.', 'Cybersecurity', 22000, 6, 2],
    ['Analytics Dashboard with Charts', 'Interactive analytics dashboard with export.', 'Python,React', 16000, 3, 0],
    ['3-Month Digital Marketing Campaign', 'Run paid + organic campaign across channels.', 'Digital Marketing,SEO', 10000, 7, 1],
  ].map(([title, description, requiredSkills, budget, cat, cl]) => ({
    title, description, requiredSkills, budget, categoryId: categories[cat].id, clientId: clients[cl].id,
    deadline: daysFromNow(30), projectType: 'FIXED_PRICE', status: 'OPEN',
  }));
  const projects = await M.Project.bulkCreate(P);

  // Proposals on open projects
  await M.Proposal.bulkCreate([
    { projectId: projects[0].id, freelancerId: freelancers[0].id, coverLetter: 'I have built several e-commerce platforms with this exact stack and can deliver in 3 weeks.', proposedAmount: 23000, estimatedDeliveryDays: 21 },
    { projectId: projects[0].id, freelancerId: freelancers[2].id, coverLetter: 'Strong backend background; I can architect a scalable order and payments flow.', proposedAmount: 24500, estimatedDeliveryDays: 25 },
    { projectId: projects[1].id, freelancerId: freelancers[1].id, coverLetter: 'Design is my speciality — I will deliver a polished, accessible portfolio.', proposedAmount: 4500, estimatedDeliveryDays: 10 },
    { projectId: projects[2].id, freelancerId: freelancers[3].id, coverLetter: 'I ship Flutter apps to both stores and have delivery-app experience.', proposedAmount: 38000, estimatedDeliveryDays: 45 },
    { projectId: projects[3].id, freelancerId: freelancers[4].id, coverLetter: 'I have integrated LLM chatbots for support teams before.', proposedAmount: 17000, estimatedDeliveryDays: 14 },
  ]);

  // Workflow demo A: an IN-PROGRESS project with contract + milestones
  const wip = await M.Project.create({ ...P[4], title: 'Marketing Site Rebuild', description: 'Rebuild marketing site in React.', requiredSkills: 'React,Node.js', budget: 23000, categoryId: categories[0].id, clientId: clients[0].id, status: 'IN_PROGRESS' });
  await M.Proposal.create({ projectId: wip.id, freelancerId: freelancers[0].id, coverLetter: 'Happy to take this on.', proposedAmount: 23000, estimatedDeliveryDays: 20, status: 'ACCEPTED' });
  const contract = await M.Contract.create({ projectId: wip.id, clientId: clients[0].id, freelancerId: freelancers[0].id, progressPercent: 50 });
  const ms = await M.Milestone.bulkCreate([
    { contractId: contract.id, title: 'UI Design', amount: 5000, status: 'PAID' },
    { contractId: contract.id, title: 'Frontend Development', amount: 8000, status: 'IN_PROGRESS' },
    { contractId: contract.id, title: 'Backend Development', amount: 10000, status: 'PENDING' },
  ]);

  // Workflow demo B: a COMPLETED project with payment + reviews
  const done = await M.Project.create({ ...P[1], title: 'Company Landing Page', description: 'Single-page marketing site.', requiredSkills: 'React', budget: 10000, categoryId: categories[0].id, clientId: clients[1].id, status: 'COMPLETED' });
  await M.Proposal.create({ projectId: done.id, freelancerId: freelancers[2].id, coverLetter: 'Delivered fast.', proposedAmount: 10000, estimatedDeliveryDays: 7, status: 'ACCEPTED' });
  await M.Contract.create({ projectId: done.id, clientId: clients[1].id, freelancerId: freelancers[2].id, progressPercent: 100 });

  await M.Payment.bulkCreate([
    { transactionId: 'TXN0000000001', projectId: done.id, payerId: clients[1].id, receiverId: freelancers[2].id, amount: 10000, status: 'SUCCESS', upiId: 'demo@upi' },
    { transactionId: 'TXN0000000002', projectId: wip.id, milestoneId: ms[0].id, payerId: clients[0].id, receiverId: freelancers[0].id, amount: 5000, status: 'SUCCESS', upiId: 'demo@upi' },
    { transactionId: 'TXN0000000003', projectId: wip.id, payerId: clients[0].id, receiverId: freelancers[0].id, amount: 3000, status: 'PENDING' },
  ]);
  await M.Review.bulkCreate([
    { projectId: done.id, reviewerId: clients[1].id, revieweeId: freelancers[2].id, rating: 5, comment: 'Very professional and delivered the project on time.' },
    { projectId: done.id, reviewerId: freelancers[2].id, revieweeId: clients[1].id, rating: 5, comment: 'Clear requirements and prompt payment. Great client.' },
  ]);

  // Sample conversation
  const conv = await M.Conversation.create({ relatedProjectId: wip.id });
  await M.ConversationMember.bulkCreate([{ conversationId: conv.id, userId: clients[0].id }, { conversationId: conv.id, userId: freelancers[0].id }]);
  await M.Message.bulkCreate([
    { conversationId: conv.id, senderId: clients[0].id, content: 'Hi John, thanks for accepting the project!', status: 'READ' },
    { conversationId: conv.id, senderId: freelancers[0].id, content: 'Happy to help. I will share the first design draft this week.', status: 'READ' },
    { conversationId: conv.id, senderId: clients[0].id, content: 'Perfect, looking forward to it.', status: 'DELIVERED' },
  ]);

  // Notifications, offers, announcement
  await M.Notification.bulkCreate([
    { userId: freelancers[0].id, message: 'Your proposal for "Marketing Site Rebuild" was accepted!', type: 'PROPOSAL_ACCEPTED' },
    { userId: clients[0].id, message: 'New proposal received for "Build an E-Commerce Website"', type: 'PROPOSAL' },
    { userId: freelancers[0].id, message: 'Payment of ₹5000 received for "Marketing Site Rebuild"', type: 'PAYMENT' },
  ]);
  await M.Offer.bulkCreate([
    { title: 'AXORA PRO OFFER', description: 'Get 20% off platform service fees.', startDate: daysFromNow(-5), endDate: '2026-12-31', status: 'ACTIVE' },
    { title: 'New Client Welcome', description: 'Post your first project free of charge.', startDate: daysFromNow(-5), endDate: '2026-12-31', status: 'ACTIVE' },
  ]);
  await M.Announcement.create({ title: 'New Feature Available', description: 'AXORA Messenger now supports file sharing.' });

  console.log('=== AXORA: demo data seeded ===');
  console.log('Admin: jelinjelin888@gmail.com / Jelin@_@888 | Freelancer: john@axora.com / Freelancer@123 | Client: client1@axora.com / Client@123');
  return true;
}

module.exports = { seedIfEmpty };

// `npm run seed`
if (require.main === module) {
  require('dotenv').config();
  M.sequelize.sync().then(seedIfEmpty).then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
