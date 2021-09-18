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
          }
        );
      }

      res.status(200).json({
        message: 'received',
      });
    });
});

router.post('/pastdue', async (req, res) => {
  console.log('this is the request');

  const sampleNotification = gateway.webhookTesting.sampleNotification(
    // braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully,
    braintree.WebhookNotification.Kind.SubscriptionWentPastDue,
    'kkqpb'
  );
  gateway.webhookNotification
    .parse(
      // req.body.bt_signature,
      sampleNotification.bt_signature,
      sampleNotification.bt_payload
      // req.body.bt_payload
    )
    .then(async (webhookNotification) => {
      if (webhookNotification.kind === 'subscription_went_past_due') {
        gateway.subscription.find(
          webhookNotification.subscription.id,
          async (err, result) => {
            try {
              const userMembershipDb = await Membership.findOne({
                subscriptionId: webhookNotification.subscription.id,
              });

              if (err) {
                throw new Error('Error setting the subscription to past Due');
              }

              console.log('subscription status is ');
              console.log(webhookNotification.subscription.status);

              userMembershipDb.status = result.status;
              // userMembershipDb.firstBillDate = new Date(result.firstBillingDate);

              const user = await User.findById(userMembershipDb.userId);

              const updateUserBillingHistory = [
                ...user.membership.billingHistory,
              ];

              const newBilling = updateUserBillingHistory.map((bill) => {
                if (
                  bill.subscriptionId === userMembershipDb.subscriptionId &&
                  bill.status === 'Active'
                ) {
                  bill.status = 'PastDue';
                }
                return bill;
              });

              user.membership = {
                billingHistory: [...newBilling],
              };

              await user.save({ validateBeforeSave: false });
              await userMembershipDb.save();

              res.status(200).json({
                message: 'received',
              });
            } catch (error) {
              res.status(500).json({
                message: error.message,
              });
            }
          }
        );
      } else {
        res.status(500).json({
          message: 'this is error 2',
        });
      }
    });
});

module.exports = router;
