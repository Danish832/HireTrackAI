const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { extractTextFromResume } = require('../utils/resumeParser');
const { parseResumeWithAI } = require('../services/resumeAIService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload resume, extract text, and parse with AI
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
    fs.unlink(filePath, () => {});
    res.status(422);
    throw new Error('Could not extract text from the uploaded file');
  }

  if (!extractedText || extractedText.trim().length < 20) {
    fs.unlink(filePath, () => {});
    res.status(422);
    throw new Error('Resume appears empty or unreadable');
  }

  const user = await User.findById(req.user._id);

  // Delete old resume file if one exists
  if (user.resumeUrl) {
    const oldPath = path.join(__dirname, '..', 'uploads', 'resumes', path.basename(user.resumeUrl));
    fs.unlink(oldPath, () => {});
  }

  user.resumeUrl = `/uploads/resumes/${req.file.filename}`;

  // Attempt AI parsing — but don't fail the whole upload if AI parsing fails
  let structuredData = null;
  let aiParseError = null;
  try {
    structuredData = await parseResumeWithAI(extractedText);
  } catch (error) {
    aiParseError = error.message;
    console.error('AI resume parsing failed:', error.message);
  }

  user.parsedResume = {
    rawText: extractedText,
    structuredData,
    uploadedAt: new Date(),
  };
  await user.save();

  res.status(200).json({
    success: true,
    message: aiParseError
      ? 'Resume uploaded, but AI parsing failed — raw text saved'
      : 'Resume uploaded and parsed successfully',
    data: {
      resumeUrl: user.resumeUrl,
      structuredData,
      aiParseError,
    },
  });
});

// @desc    Re-run AI parsing on existing resume (without re-uploading)
// @route   POST /api/resume/reparse
const reparseResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.parsedResume || !user.parsedResume.rawText) {
    res.status(404);
    throw new Error('No resume text found. Please upload a resume first.');
  }

  const structuredData = await parseResumeWithAI(user.parsedResume.rawText);

  user.parsedResume.structuredData = structuredData;
  await user.save();

  res.status(200).json({ success: true, data: structuredData });
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
  fs.unlink(filePath, () => {});

  user.resumeUrl = null;
  user.parsedResume = null;
  await user.save();

  res.status(200).json({ success: true, message: 'Resume deleted' });
});

module.exports = { uploadResume, reparseResume, getResume, deleteResume };