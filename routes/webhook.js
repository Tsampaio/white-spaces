const express = require('express');
const braintree = require('braintree');
const Membership = require('./../models/membershipModel');
const User = require('./../models/userModel');
const router = express.Router();
require('dotenv').config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

router.post('/', async (req, res) => {
  console.log('this is the request');
  // console.log(req);

  const sampleNotification = gateway.webhookTesting.sampleNotification(
    // braintree.WebhookNotification.Kind.SubscriptionWentPastDue,
    // braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully,
    braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully,
    'kkqpbr'
  );
  gateway.webhookNotification
    .parse(
      // req.body.bt_signature,
      sampleNotification.bt_signature,
      sampleNotification.bt_payload
      // req.body.bt_payload
    )
    .then(async (webhookNotification) => {
      console.log(
        '[Webhook Received ' +
          webhookNotification.timestamp +
          '] | Kind: ' +
          webhookNotification.kind
      );
      // braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully

      // Example values for webhook notification properties
      // console.log(webhookNotification);
      // console.log(webhookNotification.subscription.transactions);
      // console.log(webhookNotification.kind); // "subscriptionWentPastDue"
      // console.log(webhookNotification.timestamp); // Sun Jan 1 00:00:00 UTC 2012
      // console.log(webhookNotification.subscription.id);

      if (webhookNotification.kind === 'subscription_charged_successfully') {
        gateway.subscription.find(
          webhookNotification.subscription.id,
          async (err, result) => {
            const userMembershipDb = await Membership.findOne({
              subscriptionId: webhookNotification.subscription.id,
            });

            userMembershipDb.paidThrough = new Date(result.paidThroughDate);
            userMembershipDb.firstBillDate = new Date(result.firstBillingDate);

            const user = await User.findById(userMembershipDb.userId);

            const updateUserBillingHistory = [
              ...user.membership.billingHistory,
            ];

            const newBilling = updateUserBillingHistory.map((bill) => {
              if (
                bill.subscriptionId === userMembershipDb.subscriptionId &&
                bill.status === 'Active'
              ) {
                bill.status = 'Expired';
              }
              return bill;
            });

            user.membership = {
              billingHistory: [
                ...newBilling,
                {
                  subscriptionId: result.id,
                  firstBillingDate: result.firstBillingDate,
                  paidThroughDate: result.paidThroughDate,
                  planId: result.planId,
                  status: result.status,
                  paymentToken: result.paymentMethodToken,
                  price: result.price,
                },
              ],
            };

            await user.save({ validateBeforeSave: false });
            await userMembershipDb.save();
            // console.log('Braintree values for membership');
            // console.log(result.billingPeriodStartDate);
            // console.log(result.daysPastDue);
            // console.log(result.firstBillingDate);
            // console.log(result.paidThroughDate);
            // console.log(result.status);
          }
        );
      }

      res.status(200).json({
        message: 'received',
      });
    });
});

module.exports = router;
