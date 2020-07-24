const Course = require('./../models/courseModel');
const User = require('./../models/userModel');
const braintree = require('braintree');
const Email = require('../utils/email');
require('dotenv').config();

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({

  }, function (err, response) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(response)
    }

  });
}

exports.processPayment = (req, res) => {
  console.log("inside processPayment Controller");
  console.log(req.body);

  try {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    }, (error, result) => {
      if (error) {
        res.status(500).json()
      } else {
        res.status(200).json(result);
      }
    })
  } catch (error) {
    console.log(error);
  }
}

exports.subscriptionPayment = (req, res) => {
  console.log("inside memberPayment");
  console.log(req.body);
  try {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let planId = "monthly-plan-id";

    gateway.customer.create({
      firstName: "Manish",
      lastName: "Gupta",
      email: "mhcub3@gmail.com",
      paymentMethodNonce: nonceFromTheClient
    }, function (err, result) {
      if (result.success) {
        let customerid = result.customer.id;
        let token = result.customer.paymentMethods[0].token;

        gateway.subscription.create({
          // merchantAccountId: "",
          paymentMethodToken: token,
          planId: planId
        }, function (err, result) {
          if (result.success) {
            console.log("Subscription created successfully");
          }
        });
      }
    });


    // gateway.subscription.create({
    //   paymentMethodNonce: nonceFromTheClient,
    //   planId: planId,
    // }, (error, result) => {
    //   if(error) {
    //     res.status(500).json(error);
    //   } else {
    //     res.status(200).json(result);
    //   }
    // })

  } catch (error) {
    console.log(error);
  }
}

exports.emailThankYou = async (req, res) => {
  try {
    console.log('inside emailThankyou');
    console.log(req.body.email);

    const courseTag = req.body.courseTag;

    const user = await User.findOne({email: req.body.email});
    console.log(user);

    const course = await Course.findOne({tag: courseTag});
    console.log( course );
    await User.findByIdAndUpdate(user._id, {
      courses: [...user.courses, course._id ],
      checkout: []
    });
    // generateActivationToken(req, user);

    const url = `${req.protocol}://localhost:3000/courses/${course.tag}`;
    //Or http://localhost:3000/dashboard   for HOST
    console.log(url);
    await new Email(user, url).sendThankYou(course.name);

    res.status(200).json({
      status: 'success',
      message: 'You bought the course'
    })

  } catch (error) {
    console.log(error);
  }
}

exports.addCheckout = async (req, res) => {
  try {
    console.log("inside addCheckout");
    console.log( req.body );

    const user = await User.findOne({email: req.body.userEmail});
    console.log( user._id );

    const inCart = user.checkout.filter( (course) => {
      return course._id == req.body.selectedCourse._id;
    });

    if( inCart.length < 1 ) {
      await User.findByIdAndUpdate( user._id, {
        checkout: [...user.checkout, req.body.selectedCourse]
        // checkout: []
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Adding to Checkout'
    })
  } catch (error) {
    console.log(error);
  }
}

exports.removeCheckout = async (req, res) => {
  try {
    console.log("inside removeCheckout");
    console.log( req.body );

    const user = await User.findById(req.body.userId);
    console.log( user._id );

    const inCart = user.checkout.filter( (course) => {
      return course._id != req.body.courseId
    });

    await User.findByIdAndUpdate( user._id, {
      checkout: [...inCart]
      // checkout: []
    });

    res.status(200).json({
      status: 'success',
      message: 'Removing from Checkout'
    })
  } catch (error) {
    console.log(error);
  }
}