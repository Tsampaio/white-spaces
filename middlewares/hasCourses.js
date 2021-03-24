const Course = require('../models/courseModel');

exports.hasCourses = async (req, res, next) => {
  console.log('Inside User has course');
  try {
    console.log('Inside User has course');
    const { courseTag } = req.body;
    // console.log("this is courseTag ", courseTag);
    const course = await Course.findOne({ tag: courseTag })
    console.log(req.user);
    let userHasCourse;
    if(req.user) {
      userHasCourse = req.user.courses.find((theCourse) => {
        return JSON.stringify(theCourse) === JSON.stringify(course._id);
      });
    }
    console.log('User has course');
    console.log(userHasCourse);
    req.userHasCourse = true;
    next();
  } catch (error) {
    console.log(error);
    console.log('ERROOOOOOOORRRRRRRRRRRR');
    next()
  }
};

exports.myTest = async (req, res, next) => {
  console.log("MY TEST")
  next();
}
