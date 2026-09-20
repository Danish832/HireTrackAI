const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  generateMatchScore,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { applicationValidation } = require('../middleware/validators');
const { aiLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.get('/stats', getApplicationStats);
router.post('/', applicationValidation, createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/match-score', aiLimiter, generateMatchScore);

module.exports = router;