const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/activate/:token', authController.activate);
router.post('/activateAccount/:email', authController.emailActivation);
router.post('/login', authController.login);
router.post('/loadUser', authController.protect, authController.loadUser);
router.get('/logout', authController.logout);
router.post('/profilePic', authController.profilePic);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;