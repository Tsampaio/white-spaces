const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  tag: {
    type: String,
    unique: true,
  },
  price: {
    type: String,
  },
  classes: [
    {
      title: {
        type: String
      },
      url: {
        type: String
      },
      duration: {
        type: Number
      }
    }
  ],
  image: {
    type: String
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;