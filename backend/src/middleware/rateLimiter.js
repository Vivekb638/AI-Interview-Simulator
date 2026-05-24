const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Stricter limiter for specific endpoints (like auth/login if implemented)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts from this IP, please try again after an hour' }
});

module.exports = {
  apiLimiter,
  authLimiter
};