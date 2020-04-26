const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/loadUser', authController.protect);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
// router.use(authController.protect);

module.exports = router;