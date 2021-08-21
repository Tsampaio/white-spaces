const express = require('express');
const braintree = require('braintree');
const router = express.Router();
require('dotenv').config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})


router.post('/', (req, res) => {
  console.log("this is the request")
  // console.log(req);

  // const sampleNotification = gateway.webhookTesting.sampleNotification(
  //   braintree.WebhookNotification.Kind.SubscriptionWentPastDue,
  //   "myId"
  // );
  gateway.webhookNotification.parse(
    req.body.bt_signature,
    req.body.bt_payload,
  ).then(webhookNotification => {
      console.log("[Webhook Received " + webhookNotification.timestamp + "] | Kind: " + webhookNotification.kind);
      // braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully
      
      // Example values for webhook notification properties
      console.log(webhookNotification.kind); // "subscriptionWentPastDue"
      console.log(webhookNotification.timestamp); // Sun Jan 1 00:00:00 UTC 2012
      console.log(webhookNotification.subscription.id)
      res.status(200).json({
        message: 'received'
      });
  });


  // gateway.webhookNotification.parse(
  //   sampleNotification.bt_signature,
  //   sampleNotification.bt_payload,
  // ).then(webhookNotification => {
  //   console.log("My id")
  //   console.log(webhookNotification.subscription.id)
  //   "myId"

  //   res.json({
  //     message: "received"
  //   })
  // });
});


module.exports = router;