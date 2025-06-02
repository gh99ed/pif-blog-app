const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select('+password');
  
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('username email provider');
      if (!user) return res.status(404).json({ message: 'User not found' });
    

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };