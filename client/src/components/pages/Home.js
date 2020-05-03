import React, { Fragment } from 'react';
import Header from '../partials/Header';
import CourseCard from './CourseCard';
import './Home.css';

const Home = (props) => {
    return (
        <Fragment>
          <Header />
          <div className="container">
            <div className="row">
              
                <h3 className="popularCourses">Popular Courses</h3>
            </div>
                <div className="popularCoursesCtn">
                  <div className="row">
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                  </div>
                  
                </div>
              
            </div>
          
        </Fragment>
    )
}

export default Home;