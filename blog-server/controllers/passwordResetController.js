const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/hash');
const sendEmail = require('../utils/sendEmail');
const { verifyRecaptcha } = require('../utils/verifyRecaptcha');

// Send reset token via email (with reCAPTCHA)
const forgotPassword = async (req, res) => {
  const { email, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is missing' });
  }

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return res.status(403).json({ message: 'reCAPTCHA verification failed' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <p>Hello,</p>
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `
    });

    return res.status(200).json({ message: 'Reset link sent to email successfully!' });
  } catch (err) {
    console.error('Password reset request failed:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Handle reset via token and update the password
const resetPasswordWithToken = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }

    const hashed = await hashPassword(newPassword);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    console.error('Reset with token failed:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Check if email is Google account (for frontend to block reset password)
const checkProvider = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('provider');
  
      if (!user) {
        return res.status(404).json({ message: 'No user found with that email' });
      }
  
      return res.status(200).json({ provider: user.provider });
    } catch (err) {
      console.error('Check provider error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {
  forgotPassword,
  resetPasswordWithToken,
  checkProvider,
};
