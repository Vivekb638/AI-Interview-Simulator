const responseFormatter = require('../utils/responseFormatter');

const roleGuard = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Set by authMiddleware

      if (!user) {
        return responseFormatter.error(res, 'Unauthorized - No user context', 401);
      }

      // Check if user role is in the allowed roles array
      if (!allowedRoles.includes(user.role)) {
        return responseFormatter.error(res, 'Forbidden - Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      return responseFormatter.error(res, 'Internal Server Error', 500, error.message);
    }
  };
};

module.exports = roleGuard;
