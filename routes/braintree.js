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

router.get('/braintree/getToken/:userId', generateToken);
router.post('/braintree/payment/:userId', processPayment);
router.post('/braintree/membership/:userId', membershipPayment);
router.post('/braintree/checkout/success', emailThankYou);
router.post('/addCheckout', addCheckout);
router.post('/removeCheckout', removeCheckout);
router.post('/loadCheckout', loadCheckout);

router.post('/test', test );


// router.param("userId", userById);

module.exports = router;