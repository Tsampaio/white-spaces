const Course = require('./../models/courseModel');
const User = require('./../models/userModel');
const ClassesWatched = require('./../models/classesWatchedModel');
const { upload } = require('../utils/imageUpload');
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

const courseProgress = (classesWatched, allClasses) => {
  const classComplete =  classesWatched.filter((theClass, i) => (
    theClass.complete
  ))
  // console.log(((classComplete.length * 100) / allClasses).toFixed(0))
  return ((classComplete.length * 100) / allClasses).toFixed(0);
}

const userHasCourses = async (user, course) => {
  return new Promise((resolve, reject) => {
    const userHasCourse = user && user.courses.find((theCourse) => {
      return JSON.stringify(theCourse) === JSON.stringify(course && course._id);
    });
    
    // console.log("user has the course?? " + userHasCourse);
    if(userHasCourse) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

const checkMembership = async (theUser) => {
  return new Promise( async (resolve, reject) => {
  console.log('inside checkMembership');

  const dateInPast = function (firstDate, secondDate) {
    if (firstDate.setHours(0, 0, 0, 0) <= secondDate.setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  };

  const today = new Date();
  let past;
  let index;

  let userMembership = theUser.membership.billingHistory.find((bill) => {
    past = new Date(bill.paidThroughDate);
    return !dateInPast(past, today);
  });

  let pendingMembership = theUser.membership.billingHistory.find((bill, i) => {
    index = i;
    return bill.status === "Pending";
  });

  let user = await User.findOne({ email: theUser.email });

  const initialBill = [...theUser.membership.billingHistory];

  const fetchBillInfo = async (bills) => {
    const requests = bills.map((bill, i) => {

      return new Promise((resolve, reject) => {
        gateway.subscription.find(bill.subscriptionId, async function (err, result) {
          if (bill.status != result.status) {
            bill.status = result.status;
          }
          resolve(bill);
        });
      });
    })
    return Promise.all(requests) // Waiting for all the requests to get resolved.
  }

  const checkSame = (x, y) => {
    return JSON.stringify(x) === JSON.stringify(y);
  }

  fetchBillInfo(user.membership.billingHistory)
    .then(async (billingUpdated) => {

      const areNotEqual = initialBill.find((obj, i) => {
        // console.log(checkSame(obj, billingUpdated[i]));
        return !checkSame(obj, billingUpdated[i]);
      })

      if (areNotEqual) {
        console.log("There are changes please update");
        user.billingHistory = billingUpdated;
        await user.save({ validateBeforeSave: false });
      } else {
        console.log("they are all the same");
      }
    });


  if (pendingMembership && userMembership) {
    gateway.subscription.find(pendingMembership.subscriptionId, function (err, result) {
      resolve(Boolean(userMembership))
    })

  } else if (userMembership) {
    gateway.subscription.find(userMembership.subscriptionId, function (err, result) {
      resolve(Boolean(userMembership))
    })

  } else {
    resolve(false)
  }
  })
}

exports.getCourses = async (req, res, next) => {
  console.log("inside pagesController");
  try {

    let courses;
    let allCourses;
    // console.log( req.body.courses );
    if (req.body.courses) {
      courses = req.body.courses;
      // console.log("this is courses ");
      // console.log(courses);
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
        // console.log(values)

        return res.status(200).json({
          status: 'success',
          courses: allCourses
        });
      });

    } else {
      console.log("trying to find courses");
      allCourses = await Course.find();

      // console.log(allcourses);
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
    // console.log("INSIDE GETCOURSES OWNED CONTROLLER");
    let allCourses;
    const user = await User.findById(req.user._id);
    // console.log("Found the user for courses owned");
    // console.log(user );

    const userClasses = await ClassesWatched.find({ userId: req.user._id })
    // console.log("this is user classes");
    // console.log(userClasses)

    if (user && user.courses.length > 0) {
      Promise.all(user.courses.map(async (course) => {
        // console.log( await Course.findById( course ));
        return await Course.findById(course);
      })
      ).then(values => {
        allCourses = values;
        // console.log(values)
        let allProgress = [];
        if(userClasses.length > 0) {
          // Promise.all(userClasses.classesWatched.find(async (course) => {
          //   return await ClassesWatched.findOne({ "userId": req.user._id, "classesWatched._id": course._id })
          // })).then(values => {
          //   console.log("My courses classes found")
          //   console.log(values)
          // })

          for(let i=0; i < allCourses.length; i++) {
            allProgress[i] = 0;
            for(let j=0; j < userClasses[0].classesWatched.length; j++) {
              if(JSON.stringify(allCourses[i]._id) === JSON.stringify(userClasses[0].classesWatched[j].courseId)) {
                const progress = courseProgress(userClasses[0].classesWatched[j].classes, allCourses[i].classes.length);
                allProgress[i] = progress;
                
              }
            }
          }
        }
        // console.log("ALL Progress")
        // console.log(allProgress);
        return res.status(200).json({
          status: 'success',
          courses: allCourses,
          coursesProgress: allProgress
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
    console.log("User has course");

    const { courseTag, userId } = req.body;
    let user;
    let hasCourse;
    
    // console.log("this is courseTag ", courseTag);
    const course = await Course.findOne({ tag: courseTag }).select("-sold -revenue");
    const theCourse = course.toObject();
    if( userId ) {
      user = await User.findOne({_id: userId});
      hasCourse = userHasCourses(user, theCourse).then(async (userGotCourse) => {
        const gotMembership = checkMembership(user).then(async (memberValue) => {
          console.log("gotMembership is: " + memberValue);
          console.log("My user userGotCourse is " + userGotCourse);
          // console.log(!user || (!userGotCourse && (user && user.role !== 'admin') && !gotMembership))
          // console.log(!userGotCourse)
          // console.log(user && user.role !== 'admin')
          // console.log(!memberValue)
          
          if(!user || (!userGotCourse && (user && user.role !== 'admin') && !memberValue)) {
            console.log("This is TRUE")
            for(let i=0; i < theCourse.classes.length; i++ ) {
              console.log(theCourse.classes[i].url);
              delete theCourse.classes[i].url
            }
          }

          console.log("course classes are ");
          console.log(theCourse.classes)
          
          const userClasses = await ClassesWatched.find({ userId: req.body.userId })

          let courseIndex;
          let courseClasses;

          if(req.body.userId && userClasses.length > 0) {
            courseClasses = userClasses[0].classesWatched.find((loopCourse, i) => {
              courseIndex = i;
              return JSON.stringify(loopCourse.courseId) === JSON.stringify(course._id);
            })
          }

          const progress = courseClasses ? courseProgress(userClasses[0].classesWatched[courseIndex].classes, course.classes.length) : 0
          // console.log("THIS IS COURSE +++++");
          // console.log(theCourse)
          return res.status(200).json({
            status: 'success',
            course: theCourse,
            courseProgress: progress
          });

        })

        
      }).catch(error => console.log("The error is " + error));
    } else {

      for(let i=0; i < theCourse.classes.length; i++ ) {
        // console.log(theCourse.classes[i].url);
        delete theCourse.classes[i].url
      }

      res.status(200).json({
        status: 'success',
        course: theCourse,
        courseProgress: 0
      });
    }

  } catch (error) {
    console.log("Error in getting course")
    console.log(error);
  }
}

exports.getLessonsWatched = async (req, res, next) => {
  try {
    // console.log("inside getCourse Controller");
    const { courseTag } = req.body;
    // console.log("this is courseTag ", courseTag);
    const course = await Course.findOne({ tag: courseTag });
    // console.log("this is course ", course);

    const userClasses = await ClassesWatched.find({ userId: req.user._id })

    const courseClasses = userClasses && userClasses.length > 0 && userClasses[0].classesWatched.find(loopCourse => {
      return JSON.stringify(loopCourse.courseId) === JSON.stringify(course._id);
    })

    // console.log("the course Classes are");
    // console.log(courseClasses)
    // const userClasses = course.classes.map((theClass) => {

    //   return theClass.watched.find((watched, i) => {
    //     return JSON.stringify(watched.user) === JSON.stringify(req.user._id);
    //   })
    // });

    // for (let i = 0; i < userClasses.length; i++) {
    //   if (!userClasses[i]) {
    //     course.classes[i].watched = { complete: false }
    //   } else {
    //     course.classes[i].watched = userClasses[i];
    //   }

    // }

    // console.log('my course is');
    // console.log(course);

    res.status(200).json({
      status: 'success',
      userClasses: courseClasses && courseClasses.classes && courseClasses.classes.length > 0 ? courseClasses.classes : []
    });

  } catch (error) {
    console.log(error);
  }
}

exports.createCourse = async (req, res, next) => {
  try {
    // console.log("inside Create course");
    const { courseName, courseIntro, courseTag, courseDescription, coursePrice, classes } = req.body;

    // console.log(req.body);
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
    // if (req.files === null) {
    //   return res.status(400).json({
    //     msg: 'No file uploaded'
    //   })
    // }

    // const file = req.files.file;
    // console.log(file);
    // const userId =  req.body.userId;

    // const user = await User.findById(userId);

    // user.hasProfilePic = true;

    // await user.save({ validateBeforeSave: false });

    // const path = `${__dirname}/../client/public/${file.name}`;


    // if (fs.existsSync(path)) {
    //   //file exists
    //   fs.unlinkSync(path)
    // }

    // file.mv(`${__dirname}/../client/src/images/courses/${file.name}`, err => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send(err);
    //   }

    //   res.json({ status: "success" });
    // });

    upload(req, res, function (error) {
      if(error) {
        console.log("INSIDE UPLOAD ERROR")
        console.log(error.code)
        error.message = 'File Size is too large. Allowed file size is 100KB';
        res.status(500).json({ uploadError: error.message });
        return
      }
    })

    res.json({ message: "you got a new course pic" })

  } catch (error) {
    console.log("We are in ERROR COURSE PIC");
    console.log(error)
    res.json({ myError: error.message });
  }
}

exports.test = async (req, res) => {
  // console.log("Inside Backend Test");
  const cookieOptions = {
    expires: new Date(
      Date.now() + 80 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  const myCookie = await res.cookie('test', 'Backend Test', cookieOptions);

  // console.log(myCookie);
  res.status(200).json({ message: "success" });
}

exports.courseThumbnail = async (req, res) => {
  try {

    const courses = await Course.find();
    // console.log(courses);
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
    // console.log(req.body);

    res.status(200).json({
      access: "yes"
    })
  } catch (error) {

  }

}

exports.finishLesson = async (req, res) => {
  try {
    const userClasses = await ClassesWatched.find({ userId: req.user._id })
    const currentCourse = await Course.findOne({ _id: req.body.courseId})
    // console.log("current course is")
    // console.log(currentCourse)
    // console.log("userClass is:")
    // console.log(userClasses);
    let courseIndex;
    let lessonIndex;

    const hasCourse = req.user.courses.includes(req.body.courseId);
    
    const userHasMembership = await checkMembership(req.user).then(async (memberValue) => {
      console.log("checking course and membership");
      if(!hasCourse && !memberValue) {
        throw new Error("User doesn't have the course");
      }

      return true
      
    }).catch(error => {
      console.log("error course and membership");
      return false
    });

    console.log("user has course");
    console.log(hasCourse);
    console.log("user has membership");
    console.log(userHasMembership);

    if(!hasCourse && !userHasMembership) {
      throw new Error("User does not have the course");
    }
    
    console.log("checking after error");
    if(userClasses.length < 1) {

      const saveClass = await ClassesWatched.create({
        userId: req.user._id,
        classesWatched: [
        {
          courseId: req.body.courseId,
          classes: [
            {
              lessonNumber: req.body.lesson,
              complete: true
            }
          ]
        }
      ]
      });

      courseIndex=0;
      lessonIndex=0;

      console.log("save class is")
      console.log(saveClass)

      return res.status(200).json({
        userClasses: saveClass.classesWatched[courseIndex].classes
      })

    } else {
      // let courseIndex;
      console.log(req.body.courseId);
      const findCourse = userClasses[0].classesWatched.find((course, i) => {
        courseIndex = i;
        return JSON.stringify(course.courseId) === JSON.stringify(req.body.courseId);
      })
      console.log("find course is: position " + courseIndex);
      console.log(findCourse);
      
      if(!findCourse) {
        userClasses[0].classesWatched = [
          ...userClasses[0].classesWatched,
          {
            courseId: req.body.courseId,
            classes: [
              {
                lessonNumber: req.body.lesson,
                complete: true
              }
            ]
          }
        ]
        courseIndex= userClasses[0].classesWatched.length - 1;
        lessonIndex=0;
      } else {
        // let lessonIndex;
        const findLesson = findCourse.classes.find((lesson, i) => {
          lessonIndex = i;
          return lesson.lessonNumber === req.body.lesson
        })
        console.log("found the lesson");
        console.log(findLesson)
        if(!findLesson) {
          console.log("courseIndex is " + courseIndex);
          console.log(userClasses[0].classesWatched[courseIndex]._id)

          const userFound = await ClassesWatched.findOne({ 
            "userId": req.user._id, 
            "classesWatched._id":userClasses[0].classesWatched[courseIndex]._id })
            console.log(userFound)

          const updatedLesson = await ClassesWatched.findOneAndUpdate({ 
            "userId": req.user._id, 
            "classesWatched._id":userClasses[0].classesWatched[courseIndex]._id }, {
            "$push": { 
              "classesWatched.$.classes": {
                lessonNumber: req.body.lesson,
                complete: true
              } 
            } 
          }, {new: true})

          lessonIndex = req.body.lesson

          console.log("updated lesson is");
          console.log(updatedLesson.classesWatched[courseIndex].classes);
          const progress = courseProgress(updatedLesson.classesWatched[courseIndex].classes, currentCourse.classes.length)

          return res.status(200).json({
            userClasses: updatedLesson.classesWatched[courseIndex].classes,
            progress
          })

          // userClasses[0].classesWatched[courseIndex] = {
          //   ...userClasses[0].classesWatched[courseIndex],
          //   classes: [
          //     ...userClasses[0].classesWatched[courseIndex].classes,
          //     {
          //       lessonNumber: req.body.lesson,
          //       complete: true
          //     }
          //   ]
          // }
          // console.log(userClasses[0].classesWatched);
          // console.log(userClasses[0].classesWatched[courseIndex].classes)
          
        } else {
          userClasses[0].classesWatched[courseIndex].classes[lessonIndex].complete = !findLesson.complete;
        }

      }
      userClasses[0].save({ validateBeforeSave: false });
    }

    const progress = courseProgress(userClasses[0].classesWatched[courseIndex].classes, currentCourse.classes.length)
    console.log("progress is: " + progress);

    console.log("before saving")
    res.status(200).json({
      userClasses: userClasses[0].classesWatched[courseIndex].classes,
      progress: progress
    })

  } catch (error) {
    console.log("THIs is error");
    console.log(error);
    res.status(400).json({
      userClasses: [],
      progress: 0
    })
    
  }
}

exports.saveFeaturedCourses = async (req, res) => {
  try {
    console.log("THE BODY")
    console.log(req.body[0]);

    if (req.user.role === 'admin') {
      const fetchCourses = async (courses) => {
        const requests = courses.map(async (course, i) => {

          return new Promise(async (resolve, reject) => {
            const courseFound = await Course.findById(course._id);
            courseFound.featured = course.featured;
            courseFound.position = course.position;
            // console.log("promise course found");
            // console.log(courseFound);

            // await courseFound.save({ validateBeforeSave: false });
            resolve(courseFound);

          });
        })
        return Promise.all(requests) // Waiting for all the requests to get resolved.
      }

      fetchCourses(req.body)
        .then(async (courseFound) => {
          // console.log("THIS IS !!!!!");
          // console.log(courseFound);
          for (let i = 0; i < courseFound.length; i++) {
            await courseFound[i].save({ validateBeforeSave: false });
          }

        }).then(async () => {
          let allCourses = await Course.find();
          // console.log("All courses is ");
          // console.log(allCourses)
          // console.log("featured courses saved");
          res.status(200).json({
            courses: allCourses
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

exports.deleteVideoClass = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
    const { courseId, classId } = req.body;
    console.log(req.body);
    const course = await Course.findById(courseId);

    const removeClass = course.classes.filter((courseClass, i) => {
      return JSON.stringify(courseClass._id) !== JSON.stringify(classId)
    })
    course.classes = [...removeClass];
    await course.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Class removed",
      course
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

exports.uploadCourseImage = async (req, res) => {
  try {
    console.log("this is image")
    console.log(req.file);

    res.status(200).json({
      message: "Success"
    })
  } catch (error) {
    console.log(error)
  }
}

