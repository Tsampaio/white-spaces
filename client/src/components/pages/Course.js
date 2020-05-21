import React, { Fragment } from 'react';
import SecondHeader from '../partials/SecondHeader';
import profilePic from '../../images/telmo-pic.jpg';
import './Course.css';

const Course = () => {
  return (
    <Fragment>
      <SecondHeader />
      <div className="container">
        
          <div className="courseCtnHeader">
            <h1 className="coursePageTitle">HTML/CSS/JavaScript – Website</h1>
          
            <div className="courseInstructorCtn">
              
                <div className="courseInstructor">
                  <img src={profilePic} alt="profile" className="instructorPhoto"/>
                  <div>
                    <h5>Teacher</h5>
                    <h6>Telmo Sampaio</h6>
                  </div>
                </div>
                <div>
                  <h5>Categories</h5>
                  <h6>CSS, FRONTEND, JAVASCRIPT</h6>
                </div>
                <div className="reviews">
                  <h5>Reviews</h5>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  (4 REVIEWS)
                </div>
              
            </div>

            <div className="buyCtn">
              <a href="/cart/checkout" className="coursePageBuy">ACCESS NOW</a>
            </div>
          </div>

          <div className="courseCtnBody">
            <div className="courseIntro">
              <iframe src="https://player.vimeo.com/video/388672056" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
            </div>
            <div className="row">
              <div className="col-8">
                <h4 className="courseOverview">Overview</h4>
                <div className="courseDescription">
                  <p>In this course you are going to build a complete Login and Register system using PHP and MYSQL as a database.</p>

                  <p>We are going to build an Admin Dashboard where you can update the users details, and also be able to delete users. We will create also a blog section where Admins or moderators can post blog posts, but guests can only see them!</p>

                  <p>And finally don’t worry I will cover every single detail so you guys can easily follow along, even if you have little experience, I will add the full code in the end of the course!</p>

                  <p>By taking this course you will learn:</p>

                  <p>Learning outcome:</p>
                  <ul>
                    <li>Create a Complete Login and Registration System</li>
                    <li>Adding Security by Sanitising and Validating Data against malicious scripts</li>
                    <li>Connecting to MYSQL database with PDO</li>
                    <li>Learning how to Hash user passwords</li>
                    <li>Login and Logout with Sessions</li>
                    <li>and much more…</li>
                  </ul>
                </div>
                <h4 className="courseOverview">Curriculum</h4>
                <div className="courseClassItems">
                  <div class="courseClassLecture"><i class="far fa-file"></i>Lecture 1.1</div>
                  <div className="courseClassTitle">
                    <a href="/">MySQL Connection with PDO</a>
                    <span>26 min</span>
                  </div>
                </div>
                <div className="courseClassItems">
                  <div class="courseClassLecture"><i class="far fa-file"></i>Lecture 1.1</div>
                  <div className="courseClassTitle">
                    <a href="/">MySQL Connection with PDO</a>
                    <span>26 min</span>
                  </div>
                </div>
                <div className="courseClassItems">
                  <div class="courseClassLecture"><i class="far fa-file"></i>Lecture 1.1</div>
                  <div className="courseClassTitle">
                    <a href="/">MySQL Connection with PDO</a>
                    <span>26 min</span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                
              </div>
            </div>
          </div>
       
      </div>
    </Fragment>
  )
}

export default Course
