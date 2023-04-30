const express = require('express');
const paymentController = require('../controllers/payment_controller');
const thankYouMW = require('../middlewares/thankyoumw');

const router = express.Router();

router.post('/create-order',paymentController.createPayment);
router.post('/save-order',thankYouMW.transactionSet,paymentController.saveTransaction)

module.exports = router;