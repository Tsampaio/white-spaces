const express = require('express');
const { 
  register,
  activate,
  emailActivation,
  login,
  protect,
  loadUser,
  getUserDetails,
  getUserPurchases,
  lastLogin,
  logout,
  profilePic,
  updateUserDb,
  forgotPassword,
  resetPassword
} = require('./../controllers/authController');

const { upload } = require('../utils/imageUpload');

const router = express.Router();

router.post('/register', register);
router.post('/activate/:token', activate);
router.post('/activateAccount/:email', emailActivation);
router.post('/login', login);
router.post('/loadUser', protect, loadUser);
router.get('/getUserDetails/:id', protect, getUserDetails);
router.get('/getUserPurchases/:id', protect, getUserPurchases);
router.post('/lastLogin', protect, lastLogin);

router.get('/logout', logout);
router.post('/profilePic', protect, upload.single('file'), profilePic);
router.post('/updateUserDb', protect, updateUserDb);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;