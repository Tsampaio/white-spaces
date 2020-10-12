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
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
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
      },
      watched: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
          },
          complete: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ],
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  hasThumbnail: {
    type: Boolean,
    default: false
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;