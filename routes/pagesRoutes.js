const express = require('express');
const {
  getCourse,
  getLessonsWatched,
  getCourses,
  getCoursesOwned,
  createCourse,
  coursePic,
  deleteVideoClass,
  courseThumbnail,
  courseAccess,
  finishLesson,
  saveFeaturedCourses
} = require('./../controllers/pagesController');

const { protect } = require('../controllers/authController');

const { upload } = require('../utils/imageUpload');

const router = express.Router();
// console.log("inside routes")
router.post('/getCourse', getCourse);
// router.post('/uploadCourseImage', pagesController.uploadCourseImage);
router.post('/getLessonsWatched', protect, getLessonsWatched);
router.post('/getCourses', getCourses);
router.get('/getCoursesOwned', protect, getCoursesOwned);
router.post('/createCourse', createCourse);
router.post(
  '/coursePic/:courseTag',
  protect,
  upload.single('course'),
  coursePic
);
router.post('/deleteVideoClass', protect, deleteVideoClass);
router.post('/courseThumbnail', courseThumbnail);
router.post('/courseAccess', courseAccess);
router.post('/finishLesson', protect, finishLesson);
router.post(
  '/saveFeaturedCourses',
  protect,
  saveFeaturedCourses
);

module.exports = router;
