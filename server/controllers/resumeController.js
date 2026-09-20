const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { extractTextFromResume } = require('../utils/resumeParser');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload resume and extract raw text
// @route   POST /api/resume/upload
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const filePath = req.file.path;

  let extractedText;
  try {
    extractedText = await extractTextFromResume(filePath);
  } catch (error) {
    // Clean up the uploaded file if parsing fails
    fs.unlink(filePath, () => {});
    res.status(422);
    throw new Error('Could not extract text from the uploaded file');
  }

  if (!extractedText || extractedText.trim().length < 20) {
    fs.unlink(filePath, () => {});
    res.status(422);
    throw new Error('Resume appears empty or unreadable');
  }

  // Delete old resume file if one exists, to avoid orphaned files
  const user = await User.findById(req.user._id);
  if (user.resumeUrl) {
    const oldPath = path.join(__dirname, '..', 'uploads', 'resumes', path.basename(user.resumeUrl));
    fs.unlink(oldPath, () => {}); // ignore errors if already gone
  }

  user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
  user.parsedResume = {
    rawText: extractedText,
    uploadedAt: new Date(),
  };
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Resume uploaded and text extracted successfully',
    data: {
      resumeUrl: user.resumeUrl,
      textPreview: extractedText.substring(0, 300) + '...',
    },
  });
});

// @desc    Get current user's resume info
// @route   GET /api/resume
const getResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.resumeUrl) {
    return res.status(200).json({ success: true, data: null });
  }

  res.status(200).json({
    success: true,
    data: {
      resumeUrl: user.resumeUrl,
      parsedResume: user.parsedResume,
    },
  });
});

// @desc    Delete resume
// @route   DELETE /api/resume
const deleteResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.resumeUrl) {
    res.status(404);
    throw new Error('No resume found to delete');
  }

  const filePath = path.join(__dirname, '..', 'uploads', 'resumes', path.basename(user.resumeUrl));
  fs.unlink(filePath, () => {}); // ignore errors if file already missing

  user.resumeUrl = null;
  user.parsedResume = null;
  await user.save();

  res.status(200).json({ success: true, message: 'Resume deleted' });
});

module.exports = { uploadResume, getResume, deleteResume };