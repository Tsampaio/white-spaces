const express = require("express");
const router = express.Router();

const { 
  getUsers, 
  updateUsers, 
  deleteUsers, 
  enrolUserInCourse, 
  removeUserCourse,
  getSales,
  createCoupon
} = require('../controllers/adminController');

const { protect } = require('../controllers/authController');

router.get('/admin/getUsers', protect, getUsers);
router.post('/admin/updateUsers', protect, updateUsers);
router.post('/admin/deleteUsers', protect, deleteUsers);
router.post('/admin/enrolUserInCourse', protect, enrolUserInCourse);
router.post('/admin/removeUserCourse', protect, removeUserCourse);
router.get('/admin/getSales', protect, getSales);
router.post('/admin/createCoupon', protect, createCoupon);


module.exports = router;