const mongoose = require('mongoose');

const featuredCourseSchema = new mongoose.Schema({
  courses: [
    {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
      tag: {
        type: String,
      },
      price: {
        type: String,
      },
      featured: {
        type: Boolean,
        default: false
      }
    }
  ]

});

const FeaturedCourses = mongoose.model('FeaturedCourse', featuredCourseSchema);

module.exports = FeaturedCourses;