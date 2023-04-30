const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/user_controller');
const forgotPasswordController = require('../controllers/forgot_password_controller');


router.get('/verify-email',userController.verifyUser);
router.post('/forgot-password-auth',forgotPasswordController.forgotPasswordAuth);
router.get('/forgot-password-verify',forgotPasswordController.forgotPasswordVerify);
router.post('/forgot-password-change',forgotPasswordController.forgotPasswordChange);

router.get('/google',passport.authenticate(
    'google',
    {scope:["profile","email"]}
))

router.get('/google/callback',passport.authenticate(
    'google',
    {failureRedirect:'/user/sign-in'}
),userController.createSession);

module.exports = router;