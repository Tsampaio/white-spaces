const express = require("express");
const router = express.Router();

const { 
    generateToken, 
    processPayment, 
    membershipPayment, 
    emailThankYou,
    addCheckout,
    removeCheckout,
    loadCheckout,
    test } = require('../controllers/paymentController');

const { protect } = require('../controllers/authController');

router.get('/braintree/getToken/:userId', generateToken);
router.post('/braintree/payment/:userId', protect, processPayment);
router.post('/braintree/membership/:userId', protect, membershipPayment);
router.post('/braintree/checkout/success', emailThankYou);
router.post('/addCheckout', addCheckout);
router.post('/removeCheckout', removeCheckout);
router.post('/loadCheckout', loadCheckout);

router.post('/test', test );

module.exports = router;