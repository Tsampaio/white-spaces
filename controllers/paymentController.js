const Course = require('./../models/courseModel');
const User = require('./../models/userModel');
const Transaction = require('./../models/transactionModel');
const Coupon = require('./../models/couponModel');
const braintree = require('braintree');
const Email = require('../utils/email');
const Membership = require('./../models/membershipModel');
require('dotenv').config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = async (req, res) => {
  try {
    console.log('inside processPayment');
    let nonceFromTheClient = req.body.paymentData.paymentMethodNonce;

    let user = req.user;
    let userName = user.name.split(' ');

    console.log(req.body);
    let courses;
    if (req.body.courses[0].name === 'All Courses') {
      courses = await Course.find();
    } else {
      courses = await Course.find({ _id: { $in: req.body.courses } });
    }

    console.log(courses);

    const coursesId = courses.map((course) => {
      return course._id;
    });

    const coursesName = courses.map((course) => {
      return course.name;
    });

    const coursesPrice = courses.map((course) => {
      return course.price;
    });

    const coupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    console.log(coupon);

    const couponIsValid = () => {
      if (coupon && coupon.active && coupon.available > 0) {
        const today = new Date();
        const couponDate = new Date(coupon.date);
        const dateInPast = function (future, present) {
          if (future.setHours(0, 0, 0, 0) <= present.setHours(0, 0, 0, 0)) {
            return true;
          }
          return false;
        };
        console.log('Date in past');
        console.log(dateInPast(couponDate, today));

        return (
          coupon.active &&
          coupon.available > 0 &&
          !dateInPast(couponDate, today)
        );
      } else {
        return false;
      }
    };

    let finalPrice = courses.reduce((total, course) => {
      return parseFloat(total) + parseFloat(course.price);
    }, 0);

    if (couponIsValid()) {
      const newArray = [];
      // const coursesInCheckout = [];
      for (let i = 0; i < courses.length; i++) {
        newArray.push(courses[i].price);
        // coursesInCheckout.push(courses[i]._id)
        for (let j = 0; j < coupon.courses.length; j++) {
          console.log('+++++++++++++++');
          console.log(courses[i]._id);
          console.log(coupon.courses[j].courseId);
          console.log('-------------');
          if (
            coupon.courses[j].name === 'All Courses' ||
            JSON.stringify(courses[i]._id) ===
              JSON.stringify(coupon.courses[j].courseId)
          ) {
            console.log('Found a course');
            newArray[i] =
              coupon.amountType === 'percentage'
                ? newArray[i] - (newArray[i] * parseInt(coupon.amount)) / 100
                : newArray[i] - parseInt(coupon.amount);
            // course.price = 10
          }
        }
      }
      console.log('New array is');
      console.log(newArray);
      finalPrice = newArray.reduce((total, price) => {
        console.log('Total price is: ' + total);
        console.log('Course price is: ' + price);
        return parseFloat(total) + parseFloat(price);
      }, 0);
    }

    let amountFromTheClient = finalPrice;

    console.log('finalPrice +++++++++');
    console.log(finalPrice);

    // return res.status(200).json({
    //   success: true
    // })

    // const course = await Course.findOne({ tag: courseTag })
    // console.log(course);
    if (!user.customerId) {
      gateway.customer.create(
        {
          firstName: userName[0],
          lastName: userName[1],
          email: user.email,
        },
        (err, result) => {
          console.log('The user id is: ');
          const customerId = result.customer.id;

          gateway.transaction.sale(
            {
              customerId: customerId,
              amount: amountFromTheClient,
              paymentMethodNonce: nonceFromTheClient,
              options: {
                submitForSettlement: true,
              },
            },
            async (error, transactionResult) => {
              console.log('result is: ');
              console.log(transactionResult);
              console.log(transactionResult.transaction.amount);

              const newTransaction = await Transaction.create({
                date: new Date(),
                user: user._id,
                userName: user.name,
                userEmail: user.email,
                customerId: result.customer.id,
                productId: coursesId,
                productName: coursesName,
                coupon: req.body.code,
                price: transactionResult.transaction.amount,
                transactionId: transactionResult.transaction.id,
                productSalePrice: coursesPrice,
              });

              user.customerId = result.customer.id;

              await user.save({ validateBeforeSave: false });

              if (couponIsValid()) {
                coupon.used = coupon.used + 1;
                coupon.available = coupon.available - 1;

                await coupon.save({ validateBeforeSave: false });
              }

              return res.status(200).json({
                success: true,
                transactionId: newTransaction._id,
              });
            }
          );
        }
      );
    } else {
      gateway.customer.find(user.customerId, function (err, customer) {
        console.log('customer is:');
        console.log(customer);

        gateway.transaction.sale(
          {
            customerId: customer.id,
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
              submitForSettlement: true,
            },
          },
          async (error, transactionResult) => {
            console.log('Transaction amount is');
            console.log(transactionResult);

            const newTransaction = await Transaction.create({
              date: new Date(),
              user: user._id,
              userName: user.name,
              userEmail: user.email,
              customerId: customer.id,
              productId: coursesId,
              productName: coursesName,
              coupon: req.body.code,
              price: transactionResult.transaction.amount,
              transactionId: transactionResult.transaction.id,
              productSalePrice: coursesPrice,
            });

            if (couponIsValid()) {
              coupon.used = coupon.used + 1;
              coupon.available = coupon.available - 1;
              await coupon.save({ validateBeforeSave: false });
            }

            return res.status(200).json({
              success: true,
              transactionId: newTransaction._id,
            });
          }
        );
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: 'Error processing payment, try again!',
    });
  }
};

exports.membershipPayment = async (req, res) => {
  // console.log("inside memberPayment");
  // console.log(req.body);
  try {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    //console.log(nonceFromTheClient);
    let planId =
      req.body.membershipDuration === 'monthly'
        ? 'monthly-plan-id'
        : 'yearly-plan-id';
    let name = req.body.name.split(' ');
    const user = await User.findOne({ email: req.user.email });

    if (user.customerId) {
      let firstBillingDate = '';

      const dateInPast = function (firstDate, secondDate) {
        if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
          return true;
        }

        return false;
      };

      const today = new Date();

      let userMembership = req.user.membership.billingHistory.find((bill) => {
        let past = new Date(bill.paidThroughDate);
        //console.log(dateInPast(past, today));
        //console.log(bill);
        return !dateInPast(past, today);
      });

      if (userMembership) {
        let day = new Date(userMembership.paidThroughDate);
        // console.log(day);

        let nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        // console.log(nextDay);
        let index;
        let userMembershipActivePending =
          req.user.membership.billingHistory.find((bill, i) => {
            index = i;
            return bill.status === 'Active' || bill.status === 'Pending';
          });

        if (userMembershipActivePending) {
          await gateway.subscription.cancel(
            userMembershipActivePending.subscriptionId,
            async function (err, result) {
              //console.log(result);
              user.membership.billingHistory[index].status = 'Canceled';
              // await user.save({ validateBeforeSave: false });
            }
          );
        }

        firstBillingDate = nextDay;
      } else {
        firstBillingDate = new Date();
      }

      gateway.customer.update(
        user.customerId,
        {
          paymentMethodNonce: nonceFromTheClient,
        },
        function (err, result) {
          let token =
            result.customer.paymentMethods[
              result.customer.paymentMethods.length - 1
            ].token;
          console.log('this is the payment token');
          console.log(token);
          gateway.subscription.create(
            {
              paymentMethodToken: token,
              planId: planId,
              firstBillingDate: firstBillingDate,
            },
            async function (err, result) {
              console.log(result);
              if (result.success) {
                user.membership = {
                  billingHistory: [
                    ...user.membership.billingHistory,
                    {
                      subscriptionId: result.subscription.id,
                      firstBillingDate: result.subscription.firstBillingDate,
                      paidThroughDate: result.subscription.paidThroughDate,
                      planId: result.subscription.planId,
                      status: result.subscription.status,
                      paymentToken: result.subscription.paymentMethodToken,
                      price: result.subscription.price,
                    },
                  ],
                };

                await Membership.create({
                  userId: user._id,
                  userName: user.name,
                  userEmail: user.email,
                  customerId: customerId,
                  paidThrough: result.subscription.paidThroughDate,
                  firstBillDate: result.subscription.firstBillingDate,
                  status: 'Active',
                  subscriptionId: result.subscription.id,
                  transactionId: result.subscription.transactions[0].id,
                  price: result.subscription.price,
                });

                await Transaction.create({
                  date: new Date(),
                  user: user._id,
                  userName: user.name,
                  userEmail: user.email,
                  customerId: user.customerId,
                  productId:
                    req.body.membershipDuration === 'monthly'
                      ? '5f837d1ea687101a7cff8d66'
                      : '60678aeefeeb0055e0bc0ebb',
                  productName:
                    req.body.membershipDuration === 'monthly'
                      ? 'Monthly Membership'
                      : 'Yearly Membership',
                  price: result.subscription.price,
                  transactionId: result.subscription.id,
                });

                await user.save({ validateBeforeSave: false });
                console.log(result);
                console.log('subscription successful');

                const url = `${req.protocol}://${req.get('host')}/courses`;
                //Or http://localhost:3000/dashboard   for HOST
                // console.log(url);
                await new Email(user, url).subscriptionWelcome();
                console.log('email sent, regular client');

                return res.status(200).json({
                  // NOT SURE IF PENDING IS CORRECT
                  active: true,
                  status: result.subscription.status,
                  paymentComplete: true,
                });
              }
            }
          );
        }
      );
    } else {
      gateway.customer.create(
        {
          firstName: name[0],
          lastName: name[1],
          email: req.body.email,
          creditCard: {
            options: {
              verifyCard: true,
              verificationAmount: '1.00',
            },
          },
          paymentMethodNonce: nonceFromTheClient,
        },
        async function (err, result) {
          if (result.success) {
            let customerId = result.customer.id;
            let token = result.customer.paymentMethods[0].token;

            const user = await User.findOne({ email: req.body.email });

            gateway.subscription.create(
              {
                // merchantAccountId: "",
                paymentMethodToken: token,
                planId: planId,
              },
              async function (err, result) {
                console.log('4444444444');
                console.log(result.subscription.transactions[0]);
                // console.log(result.subscription.id);
                console.log(result);
                if (result.success) {
                  user.membership = {
                    billingHistory: [
                      ...user.membership.billingHistory,
                      {
                        subscriptionId: result.subscription.id,
                        firstBillingDate: result.subscription.firstBillingDate,
                        paidThroughDate: result.subscription.paidThroughDate,
                        planId: result.subscription.planId,
                        status: result.subscription.status,
                        paymentToken: result.subscription.paymentMethodToken,
                        price: result.subscription.price,
                      },
                    ],
                  };

                  await Membership.create({
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    customerId: customerId,
                    paidThrough: result.subscription.paidThroughDate,
                    firstBillDate: result.subscription.firstBillingDate,
                    status: 'Active',
                    subscriptionId: result.subscription.id,
                    transactionId: result.subscription.transactions[0].id,
                    price: result.subscription.price,
                  });

                  await Transaction.create({
                    date: new Date(),
                    user: user._id,
                    userName: user.name,
                    userEmail: user.email,
                    customerId: customerId,
                    productId:
                      req.body.membershipDuration === 'monthly'
                        ? '5f837d1ea687101a7cff8d66'
                        : '',
                    productName:
                      req.body.membershipDuration === 'monthly'
                        ? 'Monthly Membership'
                        : 'Annual Membership',
                    price: result.subscription.price,
                    transactionId: result.subscription.id,
                  });

                  user.customerId = customerId;
                  await user.save({ validateBeforeSave: false });
                  // console.log("Subscription created successfully");

                  const url = `${req.protocol}://${req.get('host')}/courses`;
                  //Or http://localhost:3000/dashboard   for HOST
                  // console.log(url);
                  await new Email(user, url).subscriptionWelcome();
                  console.log('email sent, new client');
                  return res.status(200).json({
                    // NOT SURE IF PENDING IS CORRECT
                    active: true,
                    status: result.subscription.status,
                    paymentComplete: true,
                  });
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.emailThankYou = async (req, res) => {
  try {
    // console.log('inside emailThankyou');
    // console.log(req.body.email);

    const { transactionId } = req.body;

    const transaction = await Transaction.findById(transactionId);
    console.log('THE TRANSACTION IS');

    const courses = await Course.find({ _id: { $in: transaction.productId } });

    console.log(transaction);
    const user = await User.findById(transaction.user);
    console.log(user._id);
    console.log(transaction.user);

    const bulkUpdateOps = courses.map((course, i) => {
      return {
        updateOne: {
          filter: { _id: course._id },
          update: {
            $set: {
              users: [...course.users, user._id],
              sold: course.sold + 1,
              revenue: course.revenue + transaction.productSalePrice[i],
            },
          },
        },
      };
    });

    if (JSON.stringify(user._id) === JSON.stringify(transaction.user)) {
      console.log('WE HAVE THE RIGHT USER');
    } else {
      console.log('WE HAVE THE WRONG USER');
    }

    await User.findByIdAndUpdate(user._id, {
      courses: [...user.courses, ...transaction.productId],
      checkout: [],
      purchases: user.purchases + transaction.price,
    });

    const updateCourses = await Course.bulkWrite(bulkUpdateOps, {
      ordered: true,
      w: 1,
    });

    // await Course.updateMany({ '_id': { $in: transaction.productId } }, {
    //   $set: {
    //     users: [...course.users, user._id],
    //     sold: course.sold + 1,
    //     revenue: course.revenue + transaction.price
    //   }
    // });

    // generateActivationToken(req, user);

    const url = `${req.protocol}://${req.get('host')}/profile/courses`;
    //Or http://localhost:3000/dashboard   for HOST
    // console.log(url);
    await new Email(user, url).sendThankYou();

    res.status(200).json({
      status: 'success',
      message: 'Thank you for your purchase',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addCheckout = async (req, res) => {
  try {
    // console.log("inside addCheckout");
    // console.log( req.body );

    const user = await User.findOne({ email: req.body.userEmail });
    // console.log( user._id );

    const inCart = user.checkout.filter((course) => {
      return course._id == req.body.selectedCourse._id;
    });
    // console.log("--------------------------" );
    // console.log( inCart );

    if (inCart.length < 1) {
      // console.log( req.body.selectedCourse );
      await User.findByIdAndUpdate(user._id, {
        checkout: [...user.checkout, req.body.selectedCourse],
        // checkout: []
      });

      // console.log("+++++++++++++++++++++++++" );
      // console.log( user.checkout );
    }

    res.status(200).json({
      status: 'success',
      checkout: user.checkout,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.removeCheckout = async (req, res) => {
  try {
    // console.log("inside removeCheckout");
    // console.log( req.body );

    const user = await User.findById(req.user._id);
    // console.log( user._id );

    const inCart = user.checkout.filter((course) => {
      return course._id != req.body.courseId;
    });

    console.log(inCart);

    // await User.findByIdAndUpdate(user._id, {
    //   checkout: [...inCart]
    //   // checkout: []
    // });
    user.checkout = [...inCart];
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      checkout: user.checkout,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.loadCheckout = async (req, res) => {
  try {
    console.log('inside loadCheckout');

    const user = await User.findById(req.user._id);

    // const checkoutPrice = user.checkout.map( (course) => {
    //   return parseInt(total.price) + parseInt(course.price);
    // });
    let checkoutPrice = 0;

    if (user && user.checkout) {
      for (let i = 0; i < user.checkout.length; i++) {
        checkoutPrice += parseInt(user.checkout[i].price);
      }

      console.log('This is checkout price');

      res.status(200).json({
        status: 'success',
        checkout: user.checkout,
        checkoutPrice,
      });
    } else {
      res.status(200).json({
        status: 'success',
        checkout: [],
        checkoutPrice,
      });
    }

    // const newArray = [ { price: 25 }, { price: 25}];

    // const checkoutPrice = newArray.reduce( (total, course) => {
    //   return total.price + course.price;
    // })

    // console.log(checkoutPrice);

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
};

exports.checkMembership = async (req, res) => {
  // 1) Get user based on the token

  console.log('inside checkMembership');
  // console.log(req.token);
  // console.log(req.user);
  // console.log(req.user.membership.subscriptionId)
  const dateInPast = function (firstDate, secondDate) {
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  };

  const today = new Date();
  let past;
  let index;

  let userMembership = req.user.membership.billingHistory.find((bill) => {
    past = new Date(bill.paidThroughDate);
    //console.log(dateInPast(past, today));
    //console.log(bill);
    return !dateInPast(past, today);
  });

  let pendingMembership = req.user.membership.billingHistory.find((bill, i) => {
    index = i;
    return bill.status === 'Pending';
  });

  let user = await User.findOne({ email: req.user.email });

  const initialBill = [...req.user.membership.billingHistory];

  const fetchBillInfo = async (bills) => {
    const requests = bills.map((bill, i) => {
      return new Promise((resolve, reject) => {
        gateway.subscription.find(
          bill.subscriptionId,
          async function (err, result) {
            console.log('This is membership');
            // console.log(result)

            for (let i = 0; i < result.transactions.length; i++) {
              const findTransaction = await Transaction.find({
                transactionId: result.transactions[i].id,
              });
              console.log('findTransaction is:');
              console.log(findTransaction);

              if (findTransaction.length < 1) {
                const newTransaction = await Transaction.create({
                  date: new Date(result.transactions[i].createdAt),
                  user: user._id,
                  userName: user.name,
                  userEmail: user.email,
                  customerId: result.transactions[i].customer.id,
                  productName: [result.transactions[i].planId],
                  coupon: '',
                  price: result.transactions[i].amount,
                  transactionId: result.transactions[i].id,
                });
              }
            }

            if (
              !err &&
              (bill.status != result.status ||
                bill.paidThroughDate != result.paidThroughDate)
            ) {
              bill.status = result.status;
              bill.firstBillingDate = result.firstBillingDate;
              bill.paidThroughDate = result.paidThroughDate;
            }
            resolve(bill);
          }
        );
      });
    });
    return Promise.all(requests); // Waiting for all the requests to get resolved.
  };

  const checkSame = (x, y) => {
    return JSON.stringify(x) === JSON.stringify(y);
  };

  fetchBillInfo(user.membership.billingHistory)
    .then(async (billingUpdated) => {
      const areNotEqual = initialBill.find((obj, i) => {
        // console.log(checkSame(obj, billingUpdated[i]));
        return !checkSame(obj, billingUpdated[i]);
      });

      if (areNotEqual) {
        console.log('There are changes please update');
        user.billingHistory = billingUpdated;
        await user.save({ validateBeforeSave: false });
      } else {
        console.log('they are all the same');
      }
    })
    .catch((error) => {
      console.log('There was an error find the membership history');
      console.log(error);
    });

  if (pendingMembership && userMembership) {
    gateway.subscription.find(
      pendingMembership.subscriptionId,
      function (err, result) {
        console.log();
        res.status(200).json({
          active: Boolean(userMembership),
          planId: result.planId,
          status: result.status === 'Pending' ? 'Active' : result.status,
          nextBillingDate: result.nextBillingDate,
          paidThroughDate: userMembership.paidThroughDate,
          price: result.price,
        });
      }
    );
  } else if (userMembership) {
    gateway.subscription.find(
      userMembership.subscriptionId,
      function (err, result) {
        res.status(200).json({
          active: Boolean(userMembership),
          planId: result.planId,
          status: result.status === 'Pending' ? 'Active' : result.status,
          nextBillingDate: result.nextBillingDate,
          paidThroughDate: result.paidThroughDate,
          price: result.price,
        });
      }
    );
  } else {
    res.status(200).json({
      active: false,
      status: 'Canceled',
    });
  }
};

exports.cancelMembership = async (req, res) => {
  const subscriptionId = req.user.membership.subscriptionId;
  console.log(subscriptionId);

  let index;

  let userMembership = req.user.membership.billingHistory.find((bill, i) => {
    index = i;
    return bill.status === 'Active' || bill.status === 'Pending';
  });

  try {
    await gateway.subscription.cancel(
      userMembership.subscriptionId,
      async function (err, result) {
        //console.log(result);
        const user = await User.findOne({ email: req.user.email });
        user.membership.billingHistory[index].status = 'Canceled';
        await user.save({ validateBeforeSave: false });

        const url = `${req.protocol}://${req.get('host')}/membership`;
        //Or http://localhost:3000/dashboard   for HOST
        // console.log(url);
        await new Email(user, url).subscriptionCancellation();
        console.log('email sent');

        res.status(200).json({
          active: true,
          status: 'Canceled',
        });

        console.log('Membership cancelled');
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.resubscribeMembership = async (req, res) => {
  console.log('inside resubscribeMembership');

  const customerId = req.user.customerId;
  // console.log(customerId);
  // console.log(typeof customerId);
  try {
    let firstBillingDate = '';
    const user = await User.findOne({ email: req.user.email });

    const dateInPast = function (firstDate, secondDate) {
      if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
        return true;
      }

      return false;
    };

    const today = new Date();

    let userMembership = req.user.membership.billingHistory.find((bill) => {
      past = new Date(bill.paidThroughDate);
      //console.log(dateInPast(past, today));
      //console.log(bill);
      return !dateInPast(past, today);
    });

    if (userMembership) {
      let day = new Date(userMembership.paidThroughDate);
      // console.log(day);

      let nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      // console.log(nextDay);

      firstBillingDate = nextDay;
    } else {
      firstBillingDate = new Date();
    }

    gateway.customer.find(customerId, function (err, customer) {
      //console.log(customer);

      gateway.subscription.create(
        {
          paymentMethodToken:
            user.membership.billingHistory[
              user.membership.billingHistory.length - 1
            ].paymentToken,
          planId: 'monthly-plan-id',
          firstBillingDate: firstBillingDate,
        },
        async function (err, result) {
          if (result.success) {
            user.membership = {
              billingHistory: [
                ...user.membership.billingHistory,
                {
                  subscriptionId: result.subscription.id,
                  firstBillingDate: result.subscription.firstBillingDate,
                  paidThroughDate: result.subscription.paidThroughDate,
                  planId: result.subscription.planId,
                  status: result.subscription.status,
                  paymentToken: result.subscription.paymentMethodToken,
                  price: result.subscription.price,
                },
              ],
            };
            await user.save({ validateBeforeSave: false });
            console.log(result);
            console.log('subscription successful');

            const url = `${req.protocol}://${req.get('host')}/courses`;
            //Or http://localhost:3000/dashboard   for HOST
            // console.log(url);
            await new Email(user, url).subscriptionWelcome();
            console.log('email sent');

            return res.status(200).json({
              // NOT SURE IF PENDING IS CORRECT
              active:
                result.subscription.status === 'Active' ||
                (userMembership && result.subscription.status === 'Pending')
                  ? true
                  : false,
              status: 'Active',
            });
          }
          return res.status(200).json({
            // NOT SURE IF PENDING IS CORRECT
            active: false,
            status: 'Failed',
          });
        }
      );
    });
    // console.log("check the first");
    // console.log(firstBillingDate)
  } catch (error) {
    console.log(error);
  }
};

exports.getUserBilling = async (req, res) => {
  try {
    const { user } = req;
    console.log(user._id);
    const allTransactions = await Transaction.find();
    console.log(allTransactions);

    const userTransactions = allTransactions.filter((transaction) => {
      console.log('this true or false');

      console.log(JSON.stringify(transaction.user) == JSON.stringify(user._id));

      return JSON.stringify(transaction.user) == JSON.stringify(user._id);
    });

    userTransactions.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    console.log(userTransactions);

    res.status(200).json({
      billing: userTransactions,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.test = async (req, res) => {
  try {
    // const user = await User.findByIdAndUpdate("5f69012f7d28a22620a57927", {
    //   courses: []
    // });

    // const user = await User.findByIdAndUpdate("5f69012f7d28a22620a57927", {
    //   customerId: "",
    //   membership: {}
    // });

    const user = await Transaction.deleteMany();

    res.send('courses deleted');
  } catch (error) {
    console.log(error);
  }
};

exports.getCouponId = async (req, res) => {
  try {
    const { couponCode } = req.params;

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    console.log(coupon);
    if (coupon) {
      res.status(200).json({
        status: 'success',
        coupon: coupon,
      });
    } else {
      throw new Error('Coupon not valid');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.webhookSubscriptionSuccess = (req, res) => {
  gateway.webhookNotification
    .parse(req.body.bt_signature, req.body.bt_payload)
    .then(async (webhookNotification) => {
      if (webhookNotification.kind === 'subscription_charged_successfully') {
        gateway.subscription.find(
          webhookNotification.subscription.id,
          async (err, result) => {
            try {
              const userMembershipDb = await Membership.findOne({
                subscriptionId: webhookNotification.subscription.id,
              });

              if (err) {
                throw new Error('Error charging subscription');
              }

              userMembershipDb.paidThrough = new Date(result.paidThroughDate);
              userMembershipDb.firstBillDate = new Date(
                result.firstBillingDate
              );

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
          message: 'This weebhook is not for PastDue subscriptions!!',
        });
      }
    });
};

exports.webhookSubscriptionPastDue = (req, res) => {
  gateway.webhookNotification
    .parse(req.body.bt_signature, req.body.bt_payload)
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
          message: 'This weebhook is not for PastDue subscriptions!!',
        });
      }
    });
};
