const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginRegister = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const generateUniqueUsername = async (base) => {
            let username = base;
            let counter = 1;
            while (await User.findOne({ username })) {
                username = `${base}${counter}`;
                counter++;
            }
            return username;
      };
        
      const rawName = name
        ?.normalize("NFD") // separate accents/diacritics
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^a-zA-Z0-9._]/g, '') // remove anything NOT valid
        .replace(/\s+/g, '')
        .toLowerCase() || 'user';

      const username = await generateUniqueUsername(rawName);
           
      user = await User.create({
        email,
        username,
        avatar: picture,
        provider: 'google',
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google login failed' });
  }
};

module.exports = { googleLoginRegister };
