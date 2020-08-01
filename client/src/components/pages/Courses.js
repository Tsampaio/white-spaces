import React, { Fragment, useEffect } from 'react';
import store from '../../store';
import { getCourses } from '../../actions/courses';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import jsCart from '../../images/javascript-shopping.jpg';
import './Courses.css';

const Courses = ({ courses }) => {
  useEffect(() => {
    store.dispatch(getCourses());
  }, []);

  console.log(courses);

  const allCourses = courses.all && courses.all.map((course, index) => {

    return (
      <div className="col-3" key={index}>
        <div className="cardBorder">
          <div className="courseThumbnail courseFeatured1">
            <Link to="/courses/javascript-shopping-cart">
              <img src={jsCart} alt="javascript" />
            </Link>
          </div>
          <div className="courseTitleCtn">
            <Link to="/courses/javascript-shopping-cart">{course.name}</Link>
          </div>
          <div className="separator"></div>
          <div className="priceCtn">
            <span className="studentNumbers"><i className="fas fa-user"></i> Telmo Sampaio</span><span className="price">${course.price}</span>
          </div>
        </div>
      </div>

    )
  })
  return (
    <Fragment>
      <SecondHeader />
      <div className="main-container">
        <div className="courses container">
          <div className="row">
            {allCourses}
          </div>
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