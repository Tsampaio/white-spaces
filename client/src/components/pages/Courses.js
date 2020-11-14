import React, { Fragment, useEffect, useState } from 'react';
import { getCourses } from '../../actions/courses';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import Loader from '../utils/Loader';
import './Courses.css';

const Courses = () => {
  const dispatch = useDispatch();
  const courses = useSelector(state => state.courses);
  const { loading } = courses

  const [coursesThumbnail, setCoursesThumbnail] = useState([]);

  useEffect(() => {
    dispatch(getCourses());
  }, []);

  console.log(courses);
  const images = require.context('../../images/courses', true);

  // const loadMyThumbNail = async () => {
  //   console.log(courses.all);
  //   const allThumbnails = courses && courses.all.map((course, index) => {
  //     return images(`./${course.tag}.jpg`);
  //   });
  //   setCoursesThumbnail(allThumbnails);
  // };

  const allCourses = courses && courses.all.map((course, index) => {

    // if( course && course.hasThumbnail) {
    //   img = images(`./${course.tag}.jpg`);
    // } else {
    //   img = images(`./default-course.jpg`);
    // }

    // let img = images(`./${course.tag}.jpg`);
    let img = `/images/${course.tag}.jpg`;
    if (course.tag != "monthly-plan") {
      return (
        <div className="offset-1 col-10 offset-md-0 col-md-4 col-lg-3" key={index}>
          <div className="cardBorder">
            <div className="courseThumbnail courseFeatured1">
              <Link to={`/courses/${course.tag}`}>
                <img src={img} alt="courseThumbnail" />
              </Link>
            </div>
            <div className="courseTitleCtn">
              <Link to={`/courses/${course.tag}`}>{course.name}</Link>
            </div>
            <div className="separator"></div>
            <div className="priceCtn">
              <span className="studentNumbers"><i className="fas fa-user"></i> Telmo Sampaio</span><span className="price">${course.price}</span>
            </div>
          </div>
        </div>
      )
    }
  })

  return (
    <Fragment>
      <SecondHeader />
      <div className="main-container">
        <div className="courses container">
          <div className="row">
            {loading ? <Loader /> : allCourses}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Courses;