const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

router.get('/profile', requireAuth, getProfile);

module.exports = router;
