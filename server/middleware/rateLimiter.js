const rateLimit = require('express-rate-limit');

// Strict limiter for login/register — brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter specifically for AI endpoints (expensive/costly calls)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI calls per hour per IP
  message: {
    success: false,
    message: 'AI request limit reached. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter, aiLimiter };