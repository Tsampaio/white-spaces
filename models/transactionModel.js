const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    customerId: {
        type: String
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    billingPeriod: {
        type: String
    },
    coupon: {
        type: String
    },
    price: {
        type: Double
    },
    transactionId: {
        type: String
    }

});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;