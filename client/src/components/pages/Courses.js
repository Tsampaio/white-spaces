import React, { Fragment, useEffect, useState } from 'react';
import store from '../../store';
import { getCourses } from '../../actions/courses';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import './Courses.css';

const Courses = ({ courses }) => {

  const [page, setPage] = useState({
    loaded: false
  })

  const [coursesThumbnail, setCoursesThumbnail] = useState([]);

  useEffect(() => {
    store.dispatch(getCourses());
    // loaderDelay();
  }, []);

  // useEffect(() => {

  //     setPage({loaded: true})


  //   loadMyThumbNail();
  // }, [courses.all])

  console.log(courses);
  const images = require.context('../../images/courses', true);

  // const loadMyThumbNail = async () => {
  //   console.log(courses.all);
  //   const allThumbnails = courses && courses.all.map((course, index) => {
  //     return images(`./${course.tag}.jpg`);
  //   });
  //   setCoursesThumbnail(allThumbnails);
  // };

  const loaderDelay = () => {
    // setTimeout(() => {
    //   setPage({loaded: true})
    // }, 500);
    setPage({ loaded: true })

  }

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
                {!page.loaded && (
                  <div className="preLoaderThumbnail">
                    <div className="spinner-border " role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>)
                }

                <img src={img} alt="courseThumbnail" onLoad={() => setPage({ loaded: true })} />


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

  console.log(page);

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