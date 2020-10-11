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
    getUserBilling,
    test } = require('../controllers/paymentController');

const { protect } = require('../controllers/authController');

router.get('/braintree/getToken/:userId', generateToken);
router.post('/braintree/payment', protect, processPayment);
router.post('/braintree/membership/:userId', protect, membershipPayment);
router.post('/braintree/checkout/success', emailThankYou);
router.post('/addCheckout', addCheckout);
router.post('/removeCheckout', removeCheckout);
router.post('/loadCheckout', loadCheckout);
router.post('/braintree/getUserBilling', protect, getUserBilling);


router.post('/test', test );

module.exports = router;