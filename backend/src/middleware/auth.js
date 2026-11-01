const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { error } = require('../utils/apiResponse');

// Verifies the JWT and attaches the authenticated user to req.user.
// Mirrors the Spring Security JwtAuthFilter: the backend always derives
// the role from the token/DB record, never from anything the client sends.
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Missing or invalid Authorization header', 401);
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) return error(res, 'User not found', 401);
    if (user.status === 'SUSPENDED') return error(res, 'Account is suspended', 403);
    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
}

// Restricts a route to one or more roles, e.g. authorize('ROLE_ADMIN').
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action', 403);
    }
    next();
  };
}

module.exports = { authenticate, authorize };
