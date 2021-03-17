const mongoose = require('mongoose');

const classesWatchedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  classesWatched: [
    {
      courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
      },
      classes: [
        {
          lessonNumber: {
            type: Number
          },
          complete: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ]
});

const ClassesWatched = mongoose.model('ClassesWatched', classesWatchedSchema);

module.exports = ClassesWatched;