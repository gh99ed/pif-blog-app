const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const { generateUniqueSuggestions } = require('../utils/generateUsernameSuggestions');

const registerValidation = [
  body('username')
    .trim()
    .custom(async (value, { req }) => {
      const existing = await User.findOne({ username: value });
      if (existing) {
        const suggestions = await generateUniqueSuggestions(value);
        req.usernameSuggestions = suggestions;
        throw new Error('Username already exists');
      }
      return true;
    }),
  body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Invalid email format')
    .custom(async (value) => {
      const existing = await User.findOne({ email: value });
      if (existing) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const validateResetPassword = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  registerValidation,
  loginValidation,
  validateResetPassword,
};
