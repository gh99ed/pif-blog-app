const express = require('express');
const {
  register,
  login,
  logout,
  resetPassword, 
  loginWith2FA,
} = require('../controllers/authController');

const {
  registerValidation,
  loginValidation,
  validateResetPassword,
} = require('../validators/authValidator');

const { changePasswordValidation } = require('../validators/userValidation');
const {
  changePassword,
  getProfile,
} = require('../controllers/userController');

const { googleLoginRegister } = require('../controllers/googleAuthController');
const {
  forgotPassword,
  resetPasswordWithToken,
  checkProvider,
} = require('../controllers/passwordResetController'); 

const validateRequest = require('../middleware/validateRequest');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Register / Login
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/login/2fa', loginWith2FA);

// Google OAuth
router.post('/google', googleLoginRegister);

// User Account
router.put('/user/change-password', requireAuth, changePasswordValidation, validateRequest, changePassword);
router.post('/check-provider', checkProvider); 
router.get('/profile', requireAuth, getProfile);
router.post('/logout', logout);

// Password Reset
router.post('/reset-password', validateResetPassword, resetPassword); 
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password/:token', resetPasswordWithToken); 
module.exports = router;
