import React, { useEffect, Fragment, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { checkMembership, cancelMembership, membershipResubscribe } from '../../actions/membership';
import store from '../../store';
import ProfileSidebar from './ProfileSidebar';
import './Profile.css';

// import {
//   base64StringtoFile,
//   downloadBase64File,
//   extractImageFileExtensionFromBase64,
//   image64toCanvasRef
// } from '../utils/imageUtils';
// import e from 'express';

function ProfileCourses({ auth, active, checkMembership, cancelMembership, membershipResubscribe }) {


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
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    console.log("before check membership ");
    if (auth && auth.user && auth.user.membership && auth.user.membership.customerId) {
      checkMembership(auth.token);
    }

    // console.log(auth);
  }, [auth && auth.user && auth.user._id]);



  const images = require.context('../../images/', true);

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
  }
  console.log(allCourses);
  return (
    <Fragment>
      <SecondHeader />
      <div className="profileCtn">
        <div className="container-fluid">
          <div className="row">
            <ProfileSidebar />
            <div className="col-lg-9 col-md-8">
            
              <div className="myCoursesCtn">
                <h1>My Courses</h1>
                <div className="row">
                  
                  {allCourses.length > 0 ? allCourses : 
                    <div className="col-12">
                      <h2>No courses owned...</h2>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

ProfileCourses.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  active: state.auth.active
});

export default connect(mapStateToProps, { checkMembership, cancelMembership, membershipResubscribe })(ProfileCourses);
