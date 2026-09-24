const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateContent } = require('../services/llm/lllmService');
const asyncHandler = require('../utils/asyncHandler');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const text = await generateContent('Say hello in one sentence then tell a very short joke');
    res.status(200).json({ success: true, response: text });
  })
);

module.exports = router;