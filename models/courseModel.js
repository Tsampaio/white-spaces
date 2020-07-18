const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  intro: {
    type: String
  },
  tag: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  sold: {
    type: Number
  },
  classes: [
    {
      lecture: {
        type: Number
      },
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