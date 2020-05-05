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

          <div className="homeObjectives">
            <div className="container">
              <h3 className="homeObjectivesMainTitle">Learning Objectives </h3>
              <p className="homeObjectivesMainDescription">The skills you can expect to achieve with us</p>
              <div className="row">
                <div className="col-4">
                  <i class="fas fa-suitcase"></i>
                  <h5 className="homeObjectivesObjTitle">Get Job Ready</h5>
                  <p className="homeObjectivesObjDescription">Gain practical experience as you go by creating portfolio-worthy projects that will help you land your next job</p>
                </div>
                <div className="col-4">
                  <i class="fas fa-trophy"></i>
                  <h5 className="homeObjectivesObjTitle">Get in-depth knowledge</h5>
                  <p className="homeObjectivesObjDescription">Learning to code means more than just memorizing syntax. Instead, we help you think like a real programmer</p>
                </div>
                <div className="col-4">
                  <i class="fas fa-globe"></i>
                  <h5 className="homeObjectivesObjTitle">Freelancing</h5>
                  <p className="homeObjectivesObjDescription">All the tips tricks you need to know to start your freelance career</p>
                </div>
              </div>

              <div className="row">
                <div className="col-4">
                  <i class="far fa-handshake"></i>
                  <h5 className="homeObjectivesObjTitle">Get Hired</h5>
                  <p className="homeObjectivesObjDescription">Learn how to build an Online Portfolio, and an Awesome CV that will get you hired</p>
                </div>
                <div className="col-4">
                  <i class="fas fa-star"></i>
                  <h5 className="homeObjectivesObjTitle">Responsive Design</h5>
                  <p className="homeObjectivesObjDescription">Learn how to build websites that will look good on Desktops, Tablets and Mobile phones</p>
                </div>
                <div className="col-4">
                  <i class="fas fa-code"></i>
                  <h5 className="homeObjectivesObjTitle">Clean Code</h5>
                  <p className="homeObjectivesObjDescription">Learn to write simple, elegante and bug free code, just like a professional</p>
                </div>
              </div>
            </div>
          </div>
          
        </Fragment>
    )
}

export default Home;