import React, { useEffect, Fragment, useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { checkMembership } from '../../actions/membership';
import Loader from '../utils/Loader';
import './Profile.css';

function ProfileCourses() {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { active, loading } = auth;

  const [page, setPage] = useState({
    loaded: false
  });

  useEffect(() => {
    // loaderDelay();
  }, []);

  const loaderDelay = () => {
    setTimeout(() => {
      setPage({ loaded: true })
    }, 500);
  }

  useEffect(() => {
    dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    console.log("before check membership ");
    if (auth && auth.user && auth.user.membership && auth.user.membership.customerId) {
      dispatch(checkMembership(auth.token));
    }

    // console.log(auth);
  }, [auth && auth.user && auth.user._id]);

  let img;

  const coursesimage = require.context('../../images/courses', true);

  const allCourses = auth && auth.coursesOwned.map((course, index) => {
    let img = "";
    if (course && course.hasThumbnail) {
      img = coursesimage(`./${course.tag}.jpg`);
    } else {
      img = coursesimage(`./default-course.jpg`);
    }

    return (
      <div className="col-xl-3 col-lg-4 col-md-6" key={index}>
        <div className="cardBorder">
          <div className="courseThumbnail courseFeatured1">
            <Link to={`/courses/${course.tag}/lessons/1`}>
              <img src={img} alt="javascript" />
            </Link>
          </div>
          <div className="courseTitleCtn">
            <Link to={`/courses/${course.tag}/lessons/1`}>{course.name}</Link>
          </div>
          <div className="separator"></div>
          <div className="priceCtn">
            <span className="studentNumbers"><i className="fas fa-user"></i> Telmo Sampaio</span><span className="price">${course.price}</span>
          </div>
        </div>
      </div>
    )
  })

  if (active == 'notActive' && !auth.loading) {
    console.log("inside redirect");
    return <Redirect to="/activate" />
  } else if (auth && !auth.isAuthenticated && !auth.loading) {
    return <Redirect to="/" />
  }

  return (
    <div className="col-lg-9 col-md-8">
      <div className="myCoursesCtn">
        <h1>My Courses</h1>
        <div className="row">
          {loading ? <Loader /> : allCourses.length > 0 ? allCourses :
            <div className="col-12">
              <h2>No courses owned...</h2>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

ProfileCourses.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // profile: PropTypes.object.isRequired
}

export default ProfileCourses;
