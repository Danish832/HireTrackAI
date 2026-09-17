const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { applicationValidation } = require('../middleware/validators');

router.use(protect); // all routes below require auth

router.get('/stats', getApplicationStats); // must come before /:id
router.post('/', applicationValidation, createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;