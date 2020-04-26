const express = require('express');
const pagesController = require('./../controllers/pagesController');

const router = express.Router();
console.log("inside routes")
router.post('/getCourses', pagesController.getCourses);

module.exports = router;