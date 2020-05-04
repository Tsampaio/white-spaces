import React, { Fragment } from 'react';
import Header from '../partials/Header';
import CourseCard from './CourseCard';
import './Home.css';

const Home = (props) => {
    return (
        <Fragment>
          <Header />
          <div className="container">
            <h3 className="popularCourses">Popular Courses</h3>
            <div className="popularCoursesCtn">
              <div className="row">
                <CourseCard />
                <CourseCard />
                <CourseCard />
                <CourseCard />
              </div>  
            </div>
          </div>
          <div className="homeCounter">
            <div className="overlay"></div>
            <div className="container">
              <div className="row">
                <div className="col-3">
                  <h1 className="homeCounterTitle">3057</h1>
                  <h5 className="homeCounterSubTitle">students</h5>
                </div>
                <div className="col-3">
                  <h1 className="homeCounterTitle">22471</h1>
                  <h5 className="homeCounterSubTitle">views</h5>
                </div>
                <div className="col-3">
                  <h1 className="homeCounterTitle">64</h1>
                  <h5 className="homeCounterSubTitle">countries reached</h5>
                </div>
                <div className="col-3">
                  <h1 className="homeCounterTitle">8</h1>
                  <h5 className="homeCounterSubTitle">courses published</h5>
                </div>
              </div>
            </div>
          </div>
          
        </Fragment>
    )
}

export default Home;