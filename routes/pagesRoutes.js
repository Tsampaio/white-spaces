const express = require('express');
const pagesController = require('./../controllers/pagesController');

const { protect } = require('../controllers/authController');

const router = express.Router();
// console.log("inside routes")
router.post('/getCourse', pagesController.getCourse);
// router.post('/uploadCourseImage', pagesController.uploadCourseImage);
router.post('/getLessonsWatched', protect, pagesController.getLessonsWatched);
router.post('/getCourses', pagesController.getCourses);
router.post('/getCoursesOwned', pagesController.getCoursesOwned);
router.post('/createCourse', pagesController.createCourse);
router.post('/coursePic', pagesController.coursePic);
router.post('/updateCourse', pagesController.updateCourse);
router.post('/deleteVideoClass', pagesController.deleteVideoClass);
router.post('/courseThumbnail', pagesController.courseThumbnail);
router.post('/courseAccess', pagesController.courseAccess);
router.post('/finishLesson', protect, pagesController.finishLesson);
router.post('/saveFeaturedCourses', protect, pagesController.saveFeaturedCourses);


module.exports = router;