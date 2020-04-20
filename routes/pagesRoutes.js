const express = require('express');
const pagesController = require('./../controllers/pagesController');

const router = express.Router();
console.log("inside routes")
router.post('/getCourses', pagesController.getCourses);
// router.post('/getCourse', pagesController.getCourse);

module.exports = router;