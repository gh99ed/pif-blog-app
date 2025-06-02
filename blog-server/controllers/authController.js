const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { verifyRecaptcha } = require('../utils/verifyRecaptcha'); 


const speakeasy = require('speakeasy');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA token is missing' });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(403).json({ message: 'reCAPTCHA verification failed' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA token is missing' });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(403).json({ message: 'reCAPTCHA verification failed' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +twoFactorEnabled');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        requires2FA: true,
        userId: user._id,
        provider: user.provider,
      });
    }

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        provider: user.provider,
        twoFactorEnabled: user.twoFactorEnabled, 
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.loginWith2FA = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId).select('+twoFactorSecret');
    
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: 'Invalid 2FA setup' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token: jwtToken,
      user: { id: user._id, username: user.username, provider: user.provider },
    });
  } catch (err) {
    res.status(500).json({ message: '2FA login failed', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout failed:', err);
    res.status(500).json({ message: 'Something went wrong during logout' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(404).json({ message: 'No user found with that email' });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword)
      return res.status(400).json({ message: 'New password cannot be the same as the old one' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
