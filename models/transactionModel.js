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
    userEmail: {
        type: String
    },
    customerId: {
        type: String
    },
    productId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    }],
    productName: [{
        type: "String"
    }],
    productSalePrice: [{
        type: Number
    }],
    billingPeriod: {
        type: String
    },
    coupon: {
        type: String
    },
    price: {
        type: Number
    },
    transactionId: {
        type: String
    }

});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;