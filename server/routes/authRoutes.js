const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimiter');


const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validators');

router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.post('/refresh', authLimiter, refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;