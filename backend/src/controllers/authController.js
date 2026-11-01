const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, FreelancerProfile, ClientProfile } = require('../models');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    subject: user.email,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

const authPayload = (user) => ({
  token: signToken(user), userId: user.id, fullName: user.fullName, email: user.email, role: user.role,
  profilePhotoUrl: user.profilePhotoUrl || null,
});

// Password rule: min 8 chars, at least one letter and one number
const strongPassword = (pw) => typeof pw === 'string' && pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, role } = req.body;

  if (!fullName || !email || !password || !confirmPassword || !role) return error(res, 'All fields are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) return error(res, 'Invalid email format');
  if (!strongPassword(password)) return error(res, 'Password must be at least 8 characters and include a letter and a number');
  if (password !== confirmPassword) return error(res, 'Passwords do not match');

  // Only FREELANCER / CLIENT can self-register; the role is validated server-side.
  const roleKey = String(role).toUpperCase();
  if (!['FREELANCER', 'CLIENT'].includes(roleKey)) return error(res, 'Invalid role. Must be FREELANCER or CLIENT');

  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) return error(res, 'Email already registered');

  const user = await User.create({
    fullName, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role: `ROLE_${roleKey}`,
  });
  if (roleKey === 'FREELANCER') await FreelancerProfile.create({ userId: user.id });
  else await ClientProfile.create({ userId: user.id });

  return success(res, 'Registration successful', authPayload(user), 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return error(res, 'Email and password are required');

  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password))) return error(res, 'Invalid email or password', 401);
  if (user.status === 'SUSPENDED') return error(res, 'Account is suspended', 403);

  return success(res, 'Login successful', authPayload(user));
});
