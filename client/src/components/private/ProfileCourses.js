import React, { useEffect, Fragment, useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { checkMembership } from '../../actions/membership';
import Loader from '../utils/Loader';
import CourseCard from '../pages/CourseCard';
import './Profile.css';

function ProfileCourses() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { loading, coursesOwnedLoaded } = auth;

  useEffect(() => {
    if(!loading && !coursesOwnedLoaded) {
      dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    }

    console.log('before check membership ');
    if (
      auth &&
      auth.user &&
      auth.user.membership &&
      auth.user.membership.customerId
    ) {
      dispatch(checkMembership(auth.token));
    }
  }, [auth && auth.user && auth.user._id]);

  const coursesimage = require.context('../../../../uploads/courses/', true);

  const allCourses =
    auth &&
    auth.coursesOwned.map((course, index) => {
      // let img = '';
      // img = coursesimage(`./${course.tag}.jpg`);

      return (
        // <div className="col-xl-3 col-lg-4 col-md-4 mb-4" key={index}>
        //   <div className="cardBorder">
        //     <div className="courseThumbnail courseFeatured1">
        //       <Link to={`/courses/${course.tag}/lessons/1`}>
        //         <img src={img.default} alt="javascript" />
        //       </Link>
        //     </div>
        //     <div className="courseTitleCtn">
        //       <Link to={`/courses/${course.tag}/lessons/1`}>{course.name}</Link>
        //     </div>
        //     <div className="separator"></div>
        //     <div className="priceCtn">
        //       <span className="studentNumbers">
        //         <i className="fas fa-user"></i> Telmo Sampaio
        //       </span>
        //       <span className="price">${course.price}</span>
        //     </div>
        //   </div>
        // </div>
        <CourseCard
          name={course.name}
          key={index}
          tag={course.tag}
          courseLevel={course.courseLevel}
        />
      );
    });

  return (
    <div className="myCoursesRightCol">
      <div className="myCoursesCtn">
        <h1>My Courses</h1>
        <div className="row">
          {loading ? (
            <Loader />
          ) : allCourses.length > 0 ? (
            allCourses
          ) : (
            <div className="col-12">
              <h2>No courses owned...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCourses;
