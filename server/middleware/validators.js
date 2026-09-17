const { body, validationResult } = require('express-validator');
const { APPLICATION_STATUSES } = require('../models/Application');





const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const applicationValidation = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('status')
    .optional()
    .isIn(APPLICATION_STATUSES)
    .withMessage(`Status must be one of: ${APPLICATION_STATUSES.join(', ')}`),
  body('jobUrl').optional().isURL().withMessage('Job URL must be valid'),
  validate,
];


module.exports = {
  registerValidation,
  loginValidation,
  applicationValidation, // ← add this
};

