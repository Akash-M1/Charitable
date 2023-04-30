const express = require('express');
const homeController = require('../controllers/home_controller');
const thankYouMW = require('../middlewares/thankyoumw');

const router = express.Router();

router.get('/',homeController.homeFileRender);
router.get('/thank-you',thankYouMW.thankYouPage,homeController.thankYouRender);
router.use('/user',require('./user'));
router.use('/payment',require('./payment'));
router.get("*",homeController.allPageRender);


module.exports = router;