const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  customerId: {
    type: String,
  },
  paidThrough: {
      type: Date,
  },
  firstBillDate: {
      type: Date,
  },
  status: {
    type: String,
  },
  subscriptionId: {
    type: String,
  },
  transactions: {
    type: Number
  },
  transactionId: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
