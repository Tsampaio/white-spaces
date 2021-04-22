const User = require('../models/userModel');
const Courses = require('../models/courseModel');
const Transactions = require('../models/transactionModel');
const Coupon = require('../models/couponModel');
const Membership = require('../models/membershipModel');
const fs = require('fs');
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.getUsers = async (req, res) => {
  console.log('Inside GET USERS');

  try {
    if (req.user.role === 'admin') {
      const allUsers = await User.find();

      console.log(allUsers);
      console.log('END OF USERS');
      res.status(200).json({
        users: allUsers,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const fetchUsers = async (users) => {
        const requests = users.map(async (user, i) => {
          return new Promise(async (resolve, reject) => {
            const userFound = await User.findById(user._id);

            if (req.body.action === 'activate') {
              userFound.active = 'active';
            }

            resolve(userFound);
          });
        });
        return Promise.all(requests); // Waiting for all the requests to get resolved.
      };

      fetchUsers(req.body.users).then(async (userFound) => {
        // console.log("THIS IS !!!!!");
        // console.log(courseFound);
        for (let i = 0; i < userFound.length; i++) {
          await userFound[i].save({ validateBeforeSave: false });
        }

        const allUsers = await User.find();

        res.status(200).json({
          users: allUsers,
        });
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log('users to delete');
      console.log(req.body.users);

      const allUsers = req.body.users.map((user) => {
        return user._id;
      });

      const path = `${__dirname}/../uploads/users/`;

      // if (fs.existsSync(path)) {
      //   //file exists
      //   fs.unlinkSync(path)
      // }

      console.log(allUsers);
      if (req.body.users.length > 1) {
        function deleteUserPhotos(allUsersId, callback) {
          let i = allUsers.length;
          allUsersId.forEach(function (filepath) {
            if (fs.existsSync(path + filepath + '.jpg')) {
              fs.unlink(path + filepath + '.jpg', function (err) {
                i--;
                if (err) {
                  callback(err);
                  return;
                } else if (i <= 0) {
                  callback(null);
                }
              });
            }
          });
        }

        deleteUserPhotos(allUsers, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('all files removed');
          }
        });

        await User.deleteMany({ _id: { $in: allUsers } });
        console.log('users deleted');
      } else {
        if (fs.existsSync(path + allUsers[0] + '.jpg')) {
          fs.unlinkSync(path + allUsers[0] + '.jpg');
        }
        await User.findByIdAndDelete(allUsers[0]);
        console.log('user was deleted');
      }

      const allDbUsers = await User.find();

      res.status(200).json({
        users: allDbUsers,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.enrolUserInCourse = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log(req.body.courseId);
      console.log(req.body.userId);

      const user = await User.findById(req.body.userId);
      const course = await Courses.findById(req.body.courseId);

      const userHasCourse = user.courses.find((course) => {
        return course._id == req.body.courseId;
      });

      if (!userHasCourse) {
        user.courses = [...user.courses, course._id];
        await user.save({ validateBeforeSave: false });

        course.users = [...course.users, user._id];
        await course.save({ validateBeforeSave: false });

        console.log('User has new Course');

        res.status(200).json({
          courses: user.courses,
          message: `${course.name} added to library`,
        });
      } else {
        throw new Error('User already has the course');
      }
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.removeUserCourse = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log(req.body.courseId);
      console.log(req.body.userId);

      const user = await User.findById(req.body.userId);
      const course = await Courses.findById(req.body.courseId);

      const userCourseRemoved = user.courses.filter((course) => {
        return course._id != req.body.courseId;
      });

      user.courses = userCourseRemoved;
      await user.save({ validateBeforeSave: false });

      const courseRemoveUser = course.users.filter((user) => {
        return user._id != req.body.userId;
      });

      course.users = courseRemoveUser;
      await course.save({ validateBeforeSave: false });

      res.status(200).json({
        courses: user.courses,
        message: `${course.name} removed from user library`,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.getSales = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const sales = await Transactions.find().sort({ date: 'desc' });

      res.status(200).json({
        sales: sales,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};
exports.createCoupon = async (req, res) => {
  try {
    console.log('Inside create coupon');
    if (req.user.role === 'admin') {
      // console.log(req.body)
      const { courses, couponDetails } = req.body;
      // console.log(courses);

      // const courses = [
      //   {
      //     courseId: '5e7e574556d0bc084c03f542',
      //     name: 'Javascript Shopping Cart',
      //   }
      // ]
      console.log(couponDetails);
      const newCoupon = await Coupon.create({
        amount: couponDetails.amount,
        code: couponDetails.code,
        name: couponDetails.name,
        date: new Date(couponDetails.expires),
        available: parseInt(couponDetails.available),
        courses: courses,
        restricted: couponDetails.emails ? couponDetails.emails : [],
      });
      res.status(200).json({
        message: 'Coupon Created',
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const coupons = await Coupon.find();
      console.log('Coupons are:');
      console.log(coupons);
      res.status(200).json({
        coupons: coupons,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const { couponId } = req.params;

      const coupon = await Coupon.findById(couponId);
      res.status(200).json({
        coupon: coupon,
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const { couponId } = req.params;

      const { couponDetails, courses } = req.body;

      couponDetails.courses = [...courses];
      couponDetails.restricted = [...couponDetails.emails];

      await Coupon.findByIdAndUpdate(couponId, couponDetails);

      res.status(200).json({
        message: 'Coupon Updated',
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      console.log('Inside course update controller');
      console.log('User is admin');
      const {
        id,
        courseName,
        courseIntro,
        courseTag,
        courseDescription,
        coursePrice,
        classes,
        courseLevel,
      } = req.body;
      // console.log("inside of update Course");
      // console.log(req.body);
      //const course = await Course.findOne({ tag });

      await Courses.findByIdAndUpdate(id, {
        name: courseName,
        intro: courseIntro,
        tag: courseTag,
        description: courseDescription,
        price: coursePrice,
        classes,
        courseLevel,
      });

      res.status(200).json({
        status: 'success',
        message: 'Course updated',
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.createMembershipRecord = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      await Membership.create({
        userId: '5f3ed1c921c7862bec590e41',
        userName: 'Telmo Sampaio',
        userEmail: 'telmoasampaio@gmail.com',
        customerId: '476293276',
        paidThrough: new Date(2020,10,17),
        firstBillDate: new Date(2020,09,18),
        status: 'Active',
        subscriptionId: '5wvgdg',
        transactionId: 'gsgn6r2f',
        price: 14.99,
      });
    }
    console.log("Created new record")
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    console.log(error);
  }
};

exports.getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    console.log("this is membership")
    // console.log(memberships);

    const allMemberships = [...memberships];
    let needsUpdate = [];
    const fetchBillInfo = async (bills) => {
      
      const requests = bills.map((bill, i) => {
  
        return new Promise((resolve, reject) => {
          gateway.subscription.find(bill.subscriptionId, async function (err, result) {
            console.log("This is membership")
            // console.log(result)
            // console.log(result)
  
            // const findTransaction = await Membership.find({transactionId: result.transactions[0].id});
            // console.log("findTransaction is:");
            // console.log(findTransaction);

            const resPayThroughDate = new Date(result.paidThroughDate);
            const billPaidThrough = new Date(bill.paidThrough);

            // console.log(resPayThroughDate);
            // console.log(billPaidThrough);
            // console.log(resPayThroughDate - billPaidThrough)
            console.log("NUMBERS:")
            console.log(result.transactions.length);
            console.log(bill.transactions);

            if((result.status !== bill.status) || (resPayThroughDate - billPaidThrough) !== 0 || (result.transactions.length !== bill.transactions) ) {
              bill.paidThrough = result.paidThroughDate;
              bill.status = result.status
              bill.transactions = result.transactions.length
              needsUpdate.push(true);
              console.log("updating....")
            }

            // console.log("This is bill");
            // console.log(bill)
  
              // if(findTransaction.length < 1) {
              //   const newTransaction = await Transaction.create({
              //     date: new Date( result.transactions[i].createdAt),
              //     user: user._id,
              //     userName: user.name,
              //     userEmail: user.email,
              //     customerId: result.transactions[i].customer.id,
              //     productName: [result.transactions[i].planId],
              //     coupon: "",
              //     price: result.transactions[i].amount,
              //     transactionId: result.transactions[i].id,
              //   });
              // }
  
            
  
            // if (!err && ((bill.status != result.status) || (bill.paidThroughDate != result.paidThroughDate))) {
            //   bill.status = result.status;
            //   bill.firstBillingDate = result.firstBillingDate
            //   bill.paidThroughDate = result.paidThroughDate
            // }
            resolve(bill);
          });
        });
      })
      return Promise.all(requests) // Waiting for all the requests to get resolved.
    }

    fetchBillInfo(allMemberships)
    .then(async (membershipsToUpdate) => {

      // const areNotEqual = initialBill.find((obj, i) => {
      //   // console.log(checkSame(obj, billingUpdated[i]));
      //   return !checkSame(obj, billingUpdated[i]);
      // })

      // if (areNotEqual) {
      //   console.log("There are changes please update");
      //   user.billingHistory = billingUpdated;
      //   await user.save({ validateBeforeSave: false });
      // } else {
      //   console.log("they are all the same");
      // }
      console.log("Needs to update is");
      console.log(needsUpdate)
      if(needsUpdate.length > 0) {
        const bulkUpdateOps = membershipsToUpdate.map((membership, i) => {
          return {
            updateOne: {
              "filter": { "_id": membership._id },
              "update": {
                $set: {
                  status: membership.status,
                  paidThrough: new Date(membership.paidThrough),
                  transactions: membership.transactions
                }
              }
            }
          }
        });
        console.log("bulkUpdateOps");
        console.log(membershipsToUpdate)

        await Membership.bulkWrite(bulkUpdateOps, { "ordered": true, "w": 1 });
        console.log("JUST UPDATED....");
      } else {
        console.log("No need for update....")
      }

      console.log("The memberships are updated")
      // console.log(billingUpdated)
    }).catch((error) => {
      console.log("There was an error find the membership history")
      console.log(error)
    });


    res.status(200).json({
      memberships: allMemberships
    })
  } catch (error) {
    console.log(error)
  }
}
