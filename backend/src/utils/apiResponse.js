// Consistent API response shape used across every endpoint:
// { success, message, data, timestamp }
function success(res, message, data = null, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

function error(res, message, status = 400) {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { success, error };
