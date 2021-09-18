const express = require('express');
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
  getCouponId,
  test,
  webhookSubscriptionSuccess,
  webhookSubscriptionPastDue,
} = require('../controllers/paymentController');

const { protect } = require('../controllers/authController');

router.get('/braintree/getToken/:userId', generateToken);
router.post('/braintree/payment', protect, processPayment);
router.post('/braintree/membership/:userId', protect, membershipPayment);
router.post('/braintree/checkout/success', emailThankYou);
router.post('/addCheckout', addCheckout);
router.post('/removeCheckout', protect, removeCheckout);
router.post('/loadCheckout', protect, loadCheckout);
router.post('/braintree/getUserBilling', protect, getUserBilling);
router.get('/getCouponId/:couponCode', protect, getCouponId);
router.post('/subscription/success', webhookSubscriptionSuccess);
router.post('/subscription/pastdue', webhookSubscriptionPastDue);

router.post('/test', test);

module.exports = router;
