const express = require('express');
const router = express.Router();
const { generate2FASecret, verify2FACode } = require('../controllers/2faController');
const { loginWith2FA} = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth'); 

router.get('/generate', requireAuth, generate2FASecret);
router.post('/verify', requireAuth, verify2FACode);
router.post('/login/2fa', loginWith2FA);

module.exports = router;
