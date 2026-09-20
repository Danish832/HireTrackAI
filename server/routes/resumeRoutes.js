const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  uploadResume,
  reparseResume,
  getResume,
  deleteResume,
} = require('../controllers/resumeController');

router.use(protect);

const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof require('multer').MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/upload', aiLimiter, handleUpload, uploadResume);
router.post('/reparse', aiLimiter, reparseResume);
router.get('/', getResume);
router.delete('/', deleteResume);

module.exports = router;