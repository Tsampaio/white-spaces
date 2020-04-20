import React, { Fragment, useEffect } from 'react';
import store from '../../store';
import { getCourses } from '../../actions/courses';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../partials/Header';

const Courses = ({ courses }) => {
  useEffect( () => {
    store.dispatch(getCourses());
  }, []);

  console.log(courses);

  const allCourses = courses.all && courses.all.map( (course, index) => {
    
    return (
      <div className="courseContainer col-sm-3" key={index}>
        <Link to="/courses/javascript-shopping-cart">
          <div className={`courseImage ${course.tag}`}></div>
        </Link>
        <div className="courseDetails">
          <Link to="/courses/javascript-shopping-cart">
            <h1>{course.name}</h1>
          </Link>
          <h5><i className="fas fa-users"></i>{course.users.length}</h5>
          <p>${course.price}</p>
        </div>
      </div>
    )
  })
  return (
    <Fragment>
      <Header />
      <div className="courses main-container container">
        <div className="row">
          <h1>Hello</h1>
          {allCourses}
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  courses: state.courses
  // profile: state.profile
});

export default connect(mapStateToProps)(Courses);