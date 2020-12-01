const express = require("express");
const router = express.Router();

const { getUsers, updateUsers } = require('../controllers/adminController');

const { protect } = require('../controllers/authController');

router.get('/admin/getUsers', protect, getUsers);
router.post('/admin/updateUsers', protect, updateUsers);

module.exports = router;