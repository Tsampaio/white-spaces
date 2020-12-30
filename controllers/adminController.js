
const User = require('../models/userModel');
const Courses = require('../models/courseModel');
const Transactions = require('../models/transactionModel');
const Coupon = require('../models/couponModel');

exports.getUsers = async (req, res) => {
  console.log("Inside GET USERS");

  try {

    if (req.user.role === 'admin') {
      const allUsers = await User.find();

      console.log(allUsers);
      console.log("END OF USERS");
      res.status(200).json({
        users: allUsers
      })
    } else {
      throw new Error('You are not an admin');
    }

  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    })
  }
};

exports.updateUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const fetchUsers = async (users) => {
        const requests = users.map(async (user, i) => {

          return new Promise(async (resolve, reject) => {
            const userFound = await User.findById(user._id);

            if (req.body.action === "activate") {
              userFound.active = "active"
            }

            resolve(userFound);

          });
        })
        return Promise.all(requests) // Waiting for all the requests to get resolved.
      }

      fetchUsers(req.body.users)
        .then(async (userFound) => {
          // console.log("THIS IS !!!!!");
          // console.log(courseFound);
          for (let i = 0; i < userFound.length; i++) {
            await userFound[i].save({ validateBeforeSave: false });
          }

          const allUsers = await User.find();

          res.status(200).json({
            users: allUsers
          })

        });

    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    })
  }
}

exports.deleteUsers = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log("users to delete");
      console.log(req.body.users);

      const allUsers = req.body.users.map(user => {
        return user._id;
      })

      console.log(allUsers);
      if (req.body.users.length > 1) {
        await User.deleteMany({ _id: { $in: allUsers } })
        console.log("users deleted");
      } else {
        await User.findByIdAndDelete(allUsers[0]);
      }

      const allDbUsers = await User.find();

      res.status(200).json({
        users: allDbUsers
      })

    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    })
  }
}

exports.enrolUserInCourse = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log(req.body.courseId);
      console.log(req.body.userId);

      const user = await User.findById(req.body.userId);
      const course = await Courses.findById(req.body.courseId);

      const userHasCourse = user.courses.find(course => {
        return course._id == req.body.courseId
      });

      if (!userHasCourse) {
        user.courses = [...user.courses, course._id];
        await user.save({ validateBeforeSave: false });

        course.users = [...course.users, user._id];
        await course.save({ validateBeforeSave: false });

        console.log("User has new Course");

        res.status(200).json({
          courses: user.courses,
          message: `${course.name} added to library`
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
      message: error.message
    });
  }
}

exports.removeUserCourse = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log(req.body.courseId);
      console.log(req.body.userId);

      const user = await User.findById(req.body.userId);
      const course = await Courses.findById(req.body.courseId);

      const userCourseRemoved = user.courses.filter(course => {
        return course._id != req.body.courseId
      });

      user.courses = userCourseRemoved;
      await user.save({ validateBeforeSave: false });

      const courseRemoveUser = course.users.filter(user => {
        return user._id != req.body.userId
      })

      course.users = courseRemoveUser;
      await course.save({ validateBeforeSave: false });

      res.status(200).json({
        courses: user.courses,
        message: `${course.name} removed from user library`
      });
    } else {
      throw new Error('You are not an admin');
    }

  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    });
  }
}

exports.getSales = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const sales = await Transactions.find().sort({ date: 'desc' });

      res.status(200).json({
        sales: sales
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    });
  }
}
exports.createCoupon = async (req, res) => {
  try {
    console.log("Inside create coupon")
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
        restricted: couponDetails.emails ? couponDetails.emails : []
      });
      res.status(200).json({
        message: "Coupon Created"
      });
    } else {
      throw new Error('You are not an admin');
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message
    });
  }
}