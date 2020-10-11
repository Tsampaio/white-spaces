const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    userName: {
        type: String
    },
    customerId: {
        type: String
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    productName: {
        type: "String"
    },
    billingPeriod: {
        type: String
    },
    coupon: {
        type: String
    },
    price: {
        type: String
    },
    transactionId: {
        type: String
    }

});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;