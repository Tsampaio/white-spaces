const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String
    // required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    }
  ],
  checkout: [ ],
  customerId: {
    type: String
  },
  purchases: {
    type: Number,
    default: 0
  },
  membership: {
    customerId: {
      type: String
    },
    billingHistory: [
      {
        subscriptionId: {
          type: String
        },
        firstBillingDate: {
          type: String
        },
        paidThroughDate: {
          type: String
        },
        planId: {
          type: String
        },
        status: {
          type: String
        },
        paymentToken: {
          type: String
        },
        price: {
          type: String
        }
      }
    ]
  },
  joined: { 
    type: Date, 
    default: Date.now 
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: String,
    default: "notActive"
  },
  activationToken: String,
  hasProfilePic: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: new Date()
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  console.log("candidatePassword is :" + candidatePassword);
  console.log("userPassword is :" + userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.activationResetToken = function() {
  const activeToken = crypto.randomBytes(32).toString('hex');

  this.activationToken = crypto
    .createHash('sha256')
    .update(activeToken)
    .digest('hex');

  console.log({ activeToken }, this.activationToken);

  return activeToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;