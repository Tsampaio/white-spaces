const express = require("express");
const router = express.Router();

const { 
  getUsers, 
  updateUsers, 
  deleteUsers, 
  enrolUserInCourse, 
  removeUserCourse,
  getSales
} = require('../controllers/adminController');

const { protect } = require('../controllers/authController');

router.get('/admin/getUsers', protect, getUsers);
router.post('/admin/updateUsers', protect, updateUsers);
router.post('/admin/deleteUsers', protect, deleteUsers);
router.post('/admin/enrolUserInCourse', protect, enrolUserInCourse);
router.post('/admin/removeUserCourse', protect, removeUserCourse);
router.get('/admin/getSales', protect, getSales);

module.exports = router;