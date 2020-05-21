const express = require("express");
const router = express.Router();

const { generateToken, processPayment, subscriptionPayment, emailThankYou } = require('../controllers/paymentController');

router.get('/braintree/getToken/:userId', generateToken);
router.post('/braintree/payment/:userId', processPayment);
router.post('/braintree/subscription/:userId', subscriptionPayment);
router.post('/braintree/checkout/success', emailThankYou);


// router.param("userId", userById);

module.exports = router;