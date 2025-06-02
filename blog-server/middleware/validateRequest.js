const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {

    const formatted = errors.array().map(err => {
      if (err.msg === 'Username already exists' && req.usernameSuggestions) {
        return {
          message: err.msg,
          suggestions: req.usernameSuggestions
        };
      }

      return {
        message: typeof err.msg === 'object' ? err.msg.message : err.msg
      };
    });

    return res.status(400).json({ errors: formatted });
  }

  next();
};

module.exports = validateRequest;
