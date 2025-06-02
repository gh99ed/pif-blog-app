const { body } = require('express-validator');

const postValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),

  body('author')
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 3 }).withMessage('Author must be at least 3 characters'),
];

module.exports = { postValidation };
