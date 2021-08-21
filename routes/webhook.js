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
  console.log(req);

  // const sampleNotification = gateway.webhookTesting.sampleNotification(
  //   braintree.WebhookNotification.Kind.SubscriptionWentPastDue,
  //   "myId"
  // );
  gateway.webhookNotification.parse(
    sampleNotification.bt_signature,
    sampleNotification.bt_payload,
  ).then(webhookNotification => {
    console.log("My id")
    console.log(webhookNotification.subscription.id)
    // "myId"

    res.json({
      message: "received"
    })
  });
});


module.exports = router;