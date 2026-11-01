const { error } = require('../utils/apiResponse');

// Global error handler — every route flows through asyncHandler, so any
// thrown error (validation, Sequelize, custom) lands here and gets turned
// into the same { success:false, message, data:null, timestamp } shape
// used everywhere else in the API.
function notFound(req, res) {
  return error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'A record with that value already exists', 400);
  }
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message).join(', ');
    return error(res, `Validation failed: ${messages}`, 400);
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return error(res, 'File size exceeds the allowed limit (max 5MB for profile pictures)', 400);
  }

  const status = err.status || 500;
  return error(res, err.message || 'Something went wrong', status);
}

module.exports = { notFound, errorHandler };
