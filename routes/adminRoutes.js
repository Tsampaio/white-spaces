const express = require("express");
const router = express.Router();

const { getUsers } = require('../controllers/adminController');

const { protect } = require('../controllers/authController');

router.get('/admin/getUsers', protect, getUsers);

module.exports = router;