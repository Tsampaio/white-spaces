const express = require("express");
const router = express.Router();

const { 
        checkMembership,
        cancelMembership,
        resubscribeMembership
    } = require('../controllers/paymentController');

const { protect } = require('../controllers/authController');

router.post('/checkMembership', protect, checkMembership);
router.post('/cancelMembership', protect, cancelMembership);
router.post('/resubscribeMembership', protect, resubscribeMembership);


module.exports = router;
