const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/userModel');

const generate2FASecret = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `BlogSystem (${user.email})`, 
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: 'QR code error' });

      return res.status(200).json({
        qrCode: data_url,
        secret: secret.base32, 
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating 2FA secret' });
  }
};

const verify2FACode = async (req, res) => {
    const { token } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ message: '2FA setup not initialized for this user' });
      }
  
      const isVerified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1, 
      });
  
      if (!isVerified) {
        return res.status(403).json({ message: 'Invalid 2FA token' });
      }
  
      user.twoFactorEnabled = true;
      await user.save();
  
      res.status(200).json({ message: '2FA enabled successfully' });
    } catch (error) {
      res.status(500).json({ message: '2FA verification failed', error: error.message });
    }
  };
  

module.exports = { generate2FASecret, verify2FACode };
