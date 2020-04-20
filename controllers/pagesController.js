const Course = require('./../models/courseModel');

exports.getCourses = async (req, res, next) => {
  console.log("inside pagesController");
  try {
    const courses = await Course.find();
    console.log(courses);
    res.status(200).json({
      status: 'success',
      courses: courses
    });

  } catch (error) {
    console.log(error);
  }

}

exports.getCourse = async (req, res, next) => {
  try {

    const { tag } = req.body;
    //console.log(tag);
    const course = await Course.findOne({ tag });
    //console.log(course);

    res.status(200).json({
      status: 'success',
      course: course
    });

  } catch (error) {
    console.log(error);
  }

}