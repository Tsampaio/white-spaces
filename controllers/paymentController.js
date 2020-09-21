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
  // console.log("inside processPayment Controller");
  // console.log(req.body);

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

exports.membershipPayment = (req, res) => {
  // console.log("inside memberPayment");
  // console.log(req.body);
  try {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let planId = "monthly-plan-id";
    let name = req.body.name.split(" ");

    gateway.customer.create({
      firstName: name[0],
      lastName: name[1],
      email: req.body.email,
      paymentMethodNonce: nonceFromTheClient
    }, async function (err, result) {
      if (result.success) {
        let customerId = result.customer.id;
        let token = result.customer.paymentMethods[0].token;

        const user = await User.findOne({ email: req.body.email});
        // console.log("////////////");
        // console.log(result);
        // console.log(user);

        gateway.subscription.create({
          // merchantAccountId: "",
          paymentMethodToken: token,
          planId: planId
        }, async function (err, result) {
          // console.log("4444444444");
          // console.log(result.subscription.id);
          console.log(result);
          if (result.success) {
            user.membership = {
              customerId: customerId,
              billingHistory: [
                ...user.membership.billingHistory,
                {
                  subscriptionId: result.subscription.id,
                  firstBillingDate: result.subscription.firstBillingDate,
                  paidThroughDate: result.subscription.paidThroughDate,
                  planId: result.subscription.planId,
                  status: result.subscription.status,
                  paymentToken: result.subscription.paymentMethodToken
                }
              ]
            }
            await user.save({ validateBeforeSave: false });
            // console.log("Subscription created successfully");
          }
        });
      }
    });


    // gateway.subscription.find("aSubscriptionId", function (err, result) {
    // });

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
    // console.log('inside emailThankyou');
    // console.log(req.body.email);

    const courseTag = req.body.courseTag;

    const user = await User.findOne({email: req.body.email});
    // console.log(user);

    const course = await Course.findOne({tag: courseTag});
    // console.log( course );

    await User.findByIdAndUpdate(user._id, {
      courses: [...user.courses, course._id ],
      checkout: []
    });
   
    // generateActivationToken(req, user);

    const url = `${req.protocol}://localhost:3000/courses/${course.tag}`;
    //Or http://localhost:3000/dashboard   for HOST
    // console.log(url);
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
    // console.log("inside addCheckout");
    // console.log( req.body );

    const user = await User.findOne({email: req.body.userEmail});
    // console.log( user._id );

    const inCart = user.checkout.filter( (course) => {
      return course._id == req.body.selectedCourse._id;
    });
    // console.log("--------------------------" );
    // console.log( inCart );
    

    if( inCart.length < 1 ) {
      // console.log( req.body.selectedCourse );
      await User.findByIdAndUpdate( user._id, {
        checkout: [...user.checkout, req.body.selectedCourse]
        // checkout: []
      });

      // console.log("+++++++++++++++++++++++++" );
      // console.log( user.checkout );
    }

    
    
    res.status(200).json({
      status: 'success',
      checkout: user.checkout
    })
  } catch (error) {
    console.log(error);
  }
}

exports.removeCheckout = async (req, res) => {
  try {
    // console.log("inside removeCheckout");
    // console.log( req.body );

    const user = await User.findById(req.body.userId);
    // console.log( user._id );

    const inCart = user.checkout.filter( (course) => {
      return course._id != req.body.courseId
    });

    await User.findByIdAndUpdate( user._id, {
      checkout: [...inCart]
      // checkout: []
    });

    res.status(200).json({
      status: 'success',
      checkout: user.checkout
    })
  } catch (error) {
    console.log(error);
  }
}

exports.loadCheckout = async (req, res) => {
  try {
    // console.log("inside loadCheckout");

    const user = await User.findById(req.body.userId);

    // const checkoutPrice = user.checkout.map( (course) => {
    //   return parseInt(total.price) + parseInt(course.price);
    // });
    let checkoutPrice = 0;

    if( user && user.checkout ) {
      for(let i=0; i < user.checkout.length; i++) {
        checkoutPrice+= parseInt(user.checkout[i].price)
      }

      res.status(200).json({
        status: 'success',
        checkout: user.checkout,
        checkoutPrice
      })
    } else {
      res.status(200).json({
        status: 'success',
        checkout: [],
        checkoutPrice
      })
    }

    // const newArray = [ { price: 25 }, { price: 25}];

    // const checkoutPrice = newArray.reduce( (total, course) => {
    //   return total.price + course.price;
    // })

    console.log(checkoutPrice);

    // console.log(user.checkout);
    // console.log("**************" +  checkoutPrice + "**************");
    // console.log(checkoutPrice);

    // res.status(200).json({
    //   status: 'success',
    //   checkout: user.checkout,
    //   checkoutPrice
    // })
  } catch (error) {
    console.log(error);
  }
}

exports.checkMembership = async (req, res) => {
  // 1) Get user based on the token

  console.log('inside checkMembership');
  console.log("-+-+-+-+-+-+-+-+");
  // console.log(req.token);
  // console.log(req.user);
  // console.log(req.user.membership.subscriptionId)
  const dateInPast = function(firstDate, secondDate) {
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }
  
    return false;
  };

  const today = new Date();
  let past;

  let userMembership = req.user.membership.billingHistory.find( (bill) => {
    past = new Date(bill.paidThroughDate);
    //console.log(dateInPast(past, today));
    //console.log(bill);
    return !dateInPast(past, today);
  });

  let pendingMembership = req.user.membership.billingHistory.find( (bill) => {
    
    //console.log(dateInPast(past, today));
    //console.log(bill);
    return bill.status === "Pending";
  });
  
  if( userMembership ) {
    gateway.subscription.find(userMembership.subscriptionId, function (err, result) {
      res.status(200).json({
        active: !dateInPast(past, today),
        status: pendingMembership ? "Active" : result.status,
        nextBillingDate: result.nextBillingDate,
        paidThroughDate: result.paidThroughDate,
        price: result.price
      });
    });
  } else {
    res.status(200).json({
      active: false
    });
  }
  
}

exports.cancelMembership = async (req, res) => {
  const subscriptionId = req.user.membership.subscriptionId;
  console.log(subscriptionId);

  let index;

  let userMembership = req.user.membership.billingHistory.find( (bill, i) => {
    index = i;
    return bill.status === "Active" || bill.status === "Pending";
  });

  try {
    await gateway.subscription.cancel( userMembership.subscriptionId, async function (err, result) {
      //console.log(result);
      const user = await User.findOne({ email: req.user.email});
      user.membership.billingHistory[index].status = "Canceled";
      await user.save({ validateBeforeSave: false });

      console.log("Membership cancelled");
    });
  } catch (error) {
    console.log(error); 
  }
}

exports.resubscribeMembership = async (req, res) => {
  console.log("inside resubscribeMembership");
  
  const customerId = req.user.membership.customerId;
  // console.log(customerId);
  // console.log(typeof customerId);
  try {
    let firstBillingDate = "";
    const user = await User.findOne({ email: req.user.email});

    const dateInPast = function(firstDate, secondDate) {
      if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
        return true;
      }
    
      return false;
    };

    const today = new Date();

    let userMembership = req.user.membership.billingHistory.find( (bill) => {
      past = new Date(bill.paidThroughDate);
      //console.log(dateInPast(past, today));
      //console.log(bill);
      return !dateInPast(past, today);
    })

    if(userMembership) {
      let day = new Date(userMembership.paidThroughDate);
      // console.log(day); 

      let nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      // console.log(nextDay);

      firstBillingDate = nextDay;
    } else {
      firstBillingDate = new Date();
    }

    gateway.customer.find(customerId, function(err, customer) {
      console.log(customer);

      gateway.subscription.create({
        paymentMethodToken: user.membership.billingHistory[user.membership.billingHistory.length - 1].paymentToken,
        planId: "monthly-plan-id",
        firstBillingDate: firstBillingDate
      }, async function (err, result) {
        user.membership = {
          ...user.membership,
          billingHistory: [
            ...user.membership.billingHistory,
            {
              subscriptionId: result.subscription.id,
              firstBillingDate: result.subscription.firstBillingDate,
              paidThroughDate: result.subscription.paidThroughDate,
              planId: result.subscription.planId,
              status: result.subscription.status,
              paymentToken: result.subscription.paymentMethodToken
            }
          ]
        }
        await user.save({ validateBeforeSave: false });
        console.log(result);
        console.log("subscription successful");
      });
    });
    // console.log("check the first");
    // console.log(firstBillingDate)
    
  } catch (error) {
    console.log(error);
  }
}



exports.test = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate("5f35b9a3b716aa48e45c64d0", {
      courses: []
    });

    res.send("courses deleted");

  } catch (error) {
    console.log(error);
  }
}