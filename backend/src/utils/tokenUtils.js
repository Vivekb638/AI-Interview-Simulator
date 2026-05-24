const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-for-dev-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const tokenUtils = {
  /**
   * Generate a generic JWT token
   * @param {Object} payload 
   * @param {String} expiresIn 
   * @returns {String} token
   */
  generateToken: (payload, expiresIn = JWT_EXPIRES_IN) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  /**
   * Verify a generic JWT token
   * @param {String} token 
   * @returns {Object} decoded payload
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
  
  /**
   * Generate a specialized token for interview sessions
   */
  generateSessionToken: (sessionId, userId, role) => {
    return tokenUtils.generateToken({ sessionId, userId, role }, '4h');
  }
};

module.exports = tokenUtils;
