import React, { Fragment, useEffect } from 'react';
import Header from '../partials/Header';
import CourseCard from './CourseCard';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../actions/courses';
import styles from './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses);
  const { coursesLoaded, all } = courses;

  useEffect(() => {
    if (!coursesLoaded) {
      dispatch(getCourses());
    }
  }, []);

  console.log(courses);

  const coursesFiltered =
    all && all.length > 0 &&
    all.filter((course) => {
      return course.featured;
    });

    coursesFiltered && coursesFiltered.length > 0 &&
    coursesFiltered.sort((a, b) => {
      return a.position - b.position;
    });

  const allFeatured =
  coursesFiltered && coursesFiltered.length > 0 &&
    coursesFiltered.map((course, i) => {
      return (
        <CourseCard
          name={course.name}
          price={course.price}
          key={i}
          tag={course.tag}
          courseLevel={course.courseLevel}
        />
      );
    });

  console.log(courses);

  return (
    <Fragment>
      <Header />
      <div className="container">
        
        <div className={styles.popularCoursesCtn}>
        <Row>
          <Col className="offset-1 offset-md-0 col-10">
            <h3 className={styles.popularCourses}>Popular Courses</h3>
          </Col>
        </Row>
          <div className="row">{allFeatured}</div>
        </div>
      </div>
      <div className={styles.homeCounter}>
        <div className={styles.overlay}></div>
        <div className="container">
          <Row>
            <Col sm={12} md={3} className="mb-4">
              <h1 className={styles.homeCounterTitle}>3057</h1>
              <h5 className={styles.homeCounterSubTitle}>students</h5>
            </Col>
            <Col sm={12} md={3} className="mb-4">
              <h1 className={styles.homeCounterTitle}>22471</h1>
              <h5 className={styles.homeCounterSubTitle}>views</h5>
            </Col>
            <Col sm={12} md={3} className="mb-4">
              <h1 className={styles.homeCounterTitle}>64</h1>
              <h5 className={styles.homeCounterSubTitle}>countries reached</h5>
            </Col>
            <Col sm={12} md={3}>
              <h1 className={styles.homeCounterTitle}>8</h1>
              <h5 className={styles.homeCounterSubTitle}>courses published</h5>
            </Col>
          </Row>
        </div>
      </div>

      <div className={styles.homeObjectives}>
        <div className="container">
          <h3 className={styles.homeObjectivesMainTitle}>
            Learning Objectives{' '}
          </h3>
          <p className={styles.homeObjectivesMainDescription}>
            The skills you can expect to achieve with us
          </p>
          <Row>
            <Col xs={6} md={4}>
              <i className="fas fa-suitcase"></i>
              <h5 className={styles.homeObjectivesObjTitle}>Get Job Ready</h5>
              <p className={styles.homeObjectivesObjDescription}>
                Gain practical experience as you go by creating portfolio-worthy
                projects that will help you land your next job
              </p>
            </Col>
            <Col xs={6} md={4}>
              <i className="fas fa-trophy"></i>
              <h5 className={styles.homeObjectivesObjTitle}>
                Get in-depth knowledge
              </h5>
              <p className={styles.homeObjectivesObjDescription}>
                Learning to code means more than just memorizing syntax.
                Instead, we help you think like a real programmer
              </p>
            </Col>
            <Col xs={6} md={4}>
              <i className="fas fa-globe"></i>
              <h5 className={styles.homeObjectivesObjTitle}>Freelancing</h5>
              <p className={styles.homeObjectivesObjDescription}>
                All the tips tricks you need to know to start your freelance
                career
              </p>
            </Col>
          
            <Col xs={6} md={4}>
              <i className="far fa-handshake"></i>
              <h5 className={styles.homeObjectivesObjTitle}>Get Hired</h5>
              <p className={styles.homeObjectivesObjDescription}>
                Learn how to build an Online Portfolio, and an Awesome CV that
                will get you hired
              </p>
            </Col>
            <Col xs={6} md={4}>
              <i className="fas fa-star"></i>
              <h5 className={styles.homeObjectivesObjTitle}>
                Responsive Design
              </h5>
              <p className={styles.homeObjectivesObjDescription}>
                Learn how to build websites that will look good on Desktops,
                Tablets and Mobile phones
              </p>
            </Col>
            <Col xs={6} md={4}>
              <i className="fas fa-code"></i>
              <h5 className={styles.homeObjectivesObjTitle}>Clean Code</h5>
              <p className={styles.homeObjectivesObjDescription}>
                Learn to write simple, elegante and bug free code, just like a
                professional
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
