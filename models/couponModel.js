const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  amountType: {
    type: String
  },
  amount: {
    type: String,
  },
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  used: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
  },
  available: {
    type: Number
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
      },
      name: {
        type: String
      }
    }
  ],
  restricted: [
    {
      email: {
        type: String
      }
    }
  ],
  active: {
    type: Boolean,
    default: true
  }
});

const Coupons = mongoose.model('Coupons', couponSchema);

module.exports = Coupons;