import React, { useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned, classWatchedUpdateReset } from '../../actions/courses';
import { checkMembership } from '../../actions/membership';
import Loader from '../utils/Loader';
import CourseCard from '../pages/CourseCard';
import './Profile.css';

function ProfileCourses() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { loading, coursesOwnedLoaded } = auth;

  const courses = useSelector((state) => state.courses);
  const { classWatchedUpdated } = courses;

  useEffect(() => {
    if(classWatchedUpdated) {
      dispatch(classWatchedUpdateReset())
      dispatch(getCoursesOwned());
    }
  }, [dispatch, classWatchedUpdated])

  useEffect(() => {
    if(!loading && !coursesOwnedLoaded) {
      dispatch(getCoursesOwned());
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
  }, [auth]);

  const coursesimage = require.context('../../../../uploads/courses/', true);

  const allCourses =
    auth && auth.coursesOwned &&
    auth.coursesOwned.map((course, index) => {
      return (
        <CourseCard
          name={course.name}
          key={index}
          index={index}
          tag={course.tag}
          courseLevel={course.courseLevel}
          courseOwned={true}
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
          ) : allCourses.length > 0 ? ( //bug here on load undefined allCourses
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
