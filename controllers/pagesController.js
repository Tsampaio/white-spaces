const Course = require('./../models/courseModel');
const User = require('./../models/userModel');
const { promisify } = require('util');

exports.getCourses = async (req, res, next) => {
  console.log("inside pagesController");
  try {

    let courses;
    let allCourses;
    // console.log( req.body.courses );
    if (req.body.courses) {
      courses = req.body.courses;
      console.log("this is courses ");
      console.log(courses);
      // allCourses = await courses.map( async (course) => {
      //   console.log( await Course.findById( course ));
      //   return await Course.findById( course );
      // })
      // let myvar;

      Promise.all(courses.map(async (course) => {
        // console.log( await Course.findById( course ));
        return await Course.findById(course);
      })
      ).then(values => {
        allCourses = values;
        console.log(values)

        return res.status(200).json({
          status: 'success',
          courses: allCourses
        });
      });

    } else {

      allCourses = await Course.find();
      return res.status(200).json({
        status: 'success',
        courses: allCourses
      });
    }


    // console.log("before res");
    // console.log( allCourses );
    // res.status(200).json({
    //   status: 'success',
    //   courses: allCourses
    // });

  } catch (error) {
    console.log(error);
  }

}

exports.getCoursesOwned = async (req, res, next) => {
  try {
    let allCourses;
    const user = await User.findById(req.body.userId);
    console.log(user );

    if( user.courses.length > 0 ) {
    Promise.all(user.courses.map(async (course) => {
      // console.log( await Course.findById( course ));
      return await Course.findById(course);
    })
    ).then(values => {
      allCourses = values;
      console.log(values)

      return res.status(200).json({
        status: 'success',
        courses: allCourses
      });
    });
  } else {
    return res.status(200).json({
      status: 'success',
      courses: []
    });
  }

  } catch (error) {
    console.log(error)
  }
}

exports.getCourse = async (req, res, next) => {
  try {
    console.log("inside getCourse Controller");
    const { courseTag } = req.body;
    console.log("this is courseTag ", courseTag);
    const course = await Course.findOne({ tag: courseTag });
    console.log("this is course ", course);

    res.status(200).json({
      status: 'success',
      course: course
    });

  } catch (error) {
    console.log(error);
  }

}

exports.updateCourse = async (req, res, next) => {
  try {
    const { id, courseName, courseIntro, courseTag, courseDescription, coursePrice, classes } = req.body;
    console.log("inside of update Course");
    console.log(req.body);
    //const course = await Course.findOne({ tag });

    await Course.findByIdAndUpdate(id, {
      name: courseName,
      intro: courseIntro,
      tag: courseTag,
      description: courseDescription,
      price: coursePrice,
      classes
    });

    res.status(200).json({
      status: 'success',
      message: "Course updated"
    });

  } catch (error) {
    console.log(error);
  }

}

exports.createCourse = async (req, res, next) => {
  try {
    console.log("inside Create course");
    const { courseName, courseIntro, courseTag, courseDescription, coursePrice, classes } = req.body;

    console.log(req.body);
    //const course = await Course.findOne({ tag });

    const course = await Course.create({
      name: courseName,
      intro: courseIntro,
      tag: courseTag,
      description: courseDescription,
      price: coursePrice,
      classes
    });

    // course.description = `<p>In this course you are going to learn how to create a Shopping Cart for an E commerce Website using JavaScript and the Local Storage.</p>`;
    // course.description += `<p><strong>IMPORTANT</strong>:&nbsp;This is a Front-End Project only, no Back-End is involved!</p>`;
    // course.description += `<p>By taking this course you will learn the following skills:</p>`;
    // course.description += `<p><strong>LEARNING OUTCOMES</strong></p>`;
    // course.description += `<ul>`;
    // course.description += `<li>Creating a Shopping Cart using HTML, CSS &amp; Vanilla JavaScript</li>`;
    // course.description += `<li>Learn how to use the Browser Local storage</li>`;
    // course.description += `<li>How to create Modular Functions</li>`;
    // course.description += `</ul>`;
    // course.description += `<p>And don’t worry, I will cover everything at a very slow pace, and explain each step of the process, if you have any questions, post them down and we will be happy to help you 🙂.</p>`;

    // course.intro = "https://player.vimeo.com/video/388672056";

    // course.classes = [
    //   {
    //     lecture: 1,
    //     title: "Building the Frontend Interface",
    //     url: "https://player.vimeo.com/video/388671124",
    //     duration: 14
    //   },
    //   {
    //     lecture: 2,
    //     title: "Adding Numbers to the Cart",
    //     url: "https://player.vimeo.com/video/388671204",
    //     duration: 19
    //   },

    // ]

    // await course.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: "Course created"
    });

  } catch (error) {
    console.log(error);
  }

}

exports.coursePic = async (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({
        msg: 'No file uploaded'
      })
    }

    const file = req.files.file;
    console.log(file);
    // const userId =  req.body.userId;

    // const user = await User.findById(userId);

    // user.hasProfilePic = true;

    // await user.save({ validateBeforeSave: false });

    // const path = `${__dirname}/../client/public/${file.name}`;


    // if (fs.existsSync(path)) {
    //   //file exists
    //   fs.unlinkSync(path)
    // }

    file.mv(`${__dirname}/../client/src/images/courses/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({ status: "success" });
    });

  } catch (err) {
    console.error(err)
  }
}

exports.test = async (req, res) => {
  console.log("Inside Backend Test");
  const cookieOptions = {
    expires: new Date(
      Date.now() + 80 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  const myCookie = await res.cookie('test', 'Backend Test', cookieOptions);

  console.log(myCookie);
  res.status(200).json({ message: "success" });
}

exports.courseThumbnail = async (req, res) => {
  try {

    const courses = await Course.find();
    console.log(courses);
    for (let i = 0; i < courses.length; i++) {
      courses[i].hasThumbnail = true;
      await courses[i].save({ validateBeforeSave: false });
    }

    // await courses.save({ validateBeforeSave: false });

    res.status(200).json({ message: "success" });

  } catch (err) {
    console.error(err)
  }
}
exports.courseAccess = async (req, res) => {

  try {
    console.log(req.body);

    res.status(200).json({
      access: "yes"
    })
  } catch (error) {

  }

}