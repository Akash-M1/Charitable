const express = require('express');
const passport = require('passport');
const multers3 = require('../config/multers3');

const router = express.Router();
const authRouter = require('./auth');
const userController = require('../controllers/user_controller');
const forgotPasswordController = require('../controllers/forgot_password_controller');

router.use('/auth',authRouter);

router.get('/profile/:id',passport.checkAuthentication,passport.checkAuthentication,userController.profile);
router.get('/sign-in',passport.signInSignUpAuthentication,userController.signIn);
router.get('/sign-up',passport.signInSignUpAuthentication,userController.signUp);
router.get('/forgot-password',forgotPasswordController.forgotPassworEmaildRender);

router.post('/create-user',multers3.single('avatar'),userController.createUser);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/user/sign-in'}
),userController.createSession);

router.get('/logout',userController.destroySession);

module.exports = router;