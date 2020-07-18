const express = require('express');
const pagesController = require('./../controllers/pagesController');

const router = express.Router();
console.log("inside routes")
router.post('/getCourse', pagesController.getCourse);
router.post('/getCourses', pagesController.getCourses);
router.post('/createCourse', pagesController.createCourse);
router.post('/updateCourse', pagesController.updateCourse);


module.exports = router;