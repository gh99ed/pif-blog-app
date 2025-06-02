const axios = require('axios');

const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('❌ Missing RECAPTCHA_SECRET_KEY in .env');
      return false;
    }

    if (!token) {
      console.error('❌ Missing recaptchaToken from client');
      return false;
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );


    return response.data.success;
  } catch (error) {
    console.error('❌ reCAPTCHA verification failed:', error.message);
    return false;
  }
};

module.exports = { verifyRecaptcha };
