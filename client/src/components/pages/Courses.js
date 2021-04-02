import React, { Fragment, useEffect, useState } from 'react';
import { getCourses } from '../../actions/courses';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import SecondHeader from '../partials/SecondHeader';
import Loader from '../utils/Loader';
import { Form } from 'react-bootstrap';
import CourseCard from './CourseCard';
import './Courses.css';

const Courses = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const { loading, all, coursesLoaded } = courses;

  const [stateCourses, setStateCourses] = useState([]);

  useEffect(() => {
    if (!coursesLoaded) {
      dispatch(getCourses());
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const sortedCourses = [...all];

      sortedCourses.length > 0 &&
        sortedCourses.sort((a, b) => {
          return a.position - b.position;
        });

      setStateCourses(sortedCourses);
    }
  }, [loading]);

  console.log(courses);
  const images = require.context('../../../../uploads/courses/', true);

  const allCourses = stateCourses.map((course, index) => {
    let img = '';
    try {
      img = images(`./${course.tag}.jpg`);
    } catch (error) {
      img = images(`./default-course.jpg`);
    }

    // let img = images(`./${course.tag}.jpg`);
    // let img = `/images/${course.tag}.jpg`;
    if (course.tag !== 'monthly-plan' && course.tag !== 'yearly-plan') {
      return (
        <CourseCard
          name={course.name}
          price={course.price}
          key={index}
          tag={course.tag}
          courseLevel={course.courseLevel}
        />
        // <div
        //   className="offset-1 col-10 offset-md-0 col-md-4 col-lg-3"
        //   key={index}
        // >
        //   <div className="cardBorder">
        //     <div className="courseThumbnail courseFeatured1">
        //       <Link to={`/courses/${course.tag}`}>
        //         <img src={img.default} alt="courseThumbnail" />
        //       </Link>
        //     </div>
        //     <div className="courseTitleCtn">
        //       <Link to={`/courses/${course.tag}`}>{course.name}</Link>
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
      );
    }
  });

  const findCourse = (e) => {
    console.log(e.target.value);
    const text = e.target.value.toLowerCase();
    console.log(text);
    const filteredCourses =
      courses &&
      courses.all.filter((course) => {
        console.log(course.name);
        return course.name.toLowerCase().indexOf(text) > -1;
      });

    console.log(filteredCourses);
    setStateCourses(filteredCourses);
  };

  return (
    <Fragment>
      <SecondHeader />
      <div className="main-container">
        <div className="courses container">
          <div className="row">
            <Col md={4} lg={3} className="offset-1 my-4 col-10 offset-md-0">
              <Form.Control
                type="text"
                placeholder="Find a course"
                onChange={findCourse}
              />
            </Col>
          </div>
          <div className="row">
            {loading ? (
              <Loader />
            ) : allCourses.length < 1 ? (
              <div className="col-6">
                <h2>No Courses found</h2>
              </div>
            ) : (
              allCourses
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Courses;
