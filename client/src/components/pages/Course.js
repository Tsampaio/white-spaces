import React, { Fragment, useEffect } from 'react';
import parse from 'html-react-parser';
import { useParams, Link, Redirect } from 'react-router-dom';
import store from '../../store';
import { connect } from 'react-redux';
import { getCourse } from '../../actions/courses';
import { addCheckout } from '../../actions/courses';

import SecondHeader from '../partials/SecondHeader';
import './Course.css';
import auth from '../../reducers/auth';

const Course = ({ course, addCheckout, auth, payment }) => {

  useEffect( () => {
    store.dispatch(getCourse(courseTag));
  }, []);

  const { courseTag } = useParams();
  console.log(courseTag);
  console.log(course);
  console.log(auth);
  const description = () => {

    if(course && course.data && course.data.description) {
      return course.data.description
    } else {
      return ""
    }
  }

  const goCheckout = async () => {
      const selectedCourse = course && course.data;
      const userEmail = auth && auth.user && auth.user.email
      await addCheckout({selectedCourse, userEmail});
  }

  let classes = course && course.data && course.data.classes.map( (theClass, i) => {
    return (
      <div className="courseClassItems" key={i}>
        <div className="courseClassLecture"><i className="far fa-file"></i>Lecture {theClass.lecture}</div>
        <div className="courseClassTitle">
          <Link to={`/courses/${course.data.tag}/lessons/1`}>{theClass.title}</Link>
          <span>{theClass.duration} min</span>
        </div>
      </div>
    );
  });

  const courseId = course && course.data && course.data._id;

  const userGotCourse = auth && auth.user && auth.user.courses.filter( (course) => {
    return course == courseId
  });
  
  console.log( payment);
  
  if( payment && payment.addingToCheckout ) {
    console.log( payment.addingToCheckout );
    return <Redirect to="/cart/checkout" />
  }

  return (
    <Fragment>
      <SecondHeader />
      <div className="container">
        
          <div className="courseCtnHeader">
            <h1 className="coursePageTitle">{course && course.data && course.data.name}</h1>
          </div>

          <div className="courseCtnBody">
            <div className="courseIntro">
              <iframe src={course && course.data && course.data.intro} width="640" height="360" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
            </div>
            <div className="row">
              <div className="col-8">
                <h4 className="courseOverview">Overview</h4>
                <div className="courseDescription">
                  { parse(description()) }
                </div>
                <div className="curriculumCtn">
                  <h4 className="courseOverview">Curriculum</h4>
                  { classes }
                </div>
              </div>
              <div className="col-4">
                <div className="card purchaseButtons">
                  <div className="card-header">
                    Unlimited access all courses
                  </div>
                  <div className="card-body">
                    <h1>$18/month</h1>
                    <Link className="membershipButton" to="/checkout"> <span className="buyMembershipPrice">Become Member</span></Link>
                  </div>
                </div>

                { userGotCourse && userGotCourse.length > 0 ? null :
                  <div className="card purchaseButtons">
                    <div className="card-header">
                      Buy Lifetime Access:
                    </div>
                    <div className="card-body">
                      <h1>${course && course.data && course.data.price} USD</h1>
                      <Link  to="/cart/checkout"></Link>
                      <button className="buyButton" onClick={goCheckout}><span className="buyCoursePrice">Buy Course</span></button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
       
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  course: state.courses,
  auth: state.auth,
  payment: state.payment
});

export default connect(mapStateToProps, {addCheckout} )(Course);
