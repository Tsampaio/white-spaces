const express = require('express');
const pagesController = require('./../controllers/pagesController');

const router = express.Router();
console.log("inside routes")
router.post('/getCourse', pagesController.getCourse);
router.post('/getCourses', pagesController.getCourses);
router.post('/createCourse', pagesController.createCourse);
router.post('/coursePic', pagesController.coursePic);
router.post('/updateCourse', pagesController.updateCourse);
router.post('/courseThumbnail', pagesController.courseThumbnail);
router.post('/courseAccess', pagesController.courseAccess);

module.exports = router;