import React, { Fragment } from 'react';
import SecondHeader from '../partials/SecondHeader';
import profilePic from '../../images/telmo-pic.jpg';
import './Course.css';

const Course = () => {
  return (
    <Fragment>
      <SecondHeader />
      <div className="container courseCtn">
        
          
          <h1 className="courseTitle">HTML/CSS/JavaScript – Website</h1>
         
          <div className="courseInstructorCtn">
            
              <div className="courseInstructor">
                <img src={profilePic} alt="profile" className="instructorPhoto"/>
                <div>
                  <h5>Teacher</h5>
                  <h6>Telmo Sampaio</h6>
                </div>
              </div>
              <div className="courseInstructor">
                <h5>Categories</h5>
                <h6>CSS, FRONTEND, JAVASCRIPT</h6>
              </div>
              <div className="courseInstructor reviews">
                <h5>Reviews</h5>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                (4 REVIEWS)
              </div>
            
          </div>
          
       
      </div>
    </Fragment>
  )
}

export default Course
