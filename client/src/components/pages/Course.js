import React, { Fragment, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { useParams, Link, Redirect } from 'react-router-dom';
import store from '../../store';
import { connect } from 'react-redux';
import { getCourse } from '../../actions/courses';
import { addCheckout } from '../../actions/courses';
import Loader from '../partials/Loader';
import SecondHeader from '../partials/SecondHeader';
import './Course.css';


const Course = ({ course, addCheckout, auth, payment }) => {

  const [page, setPage] = useState({
    loaded: false
  })

  useEffect( () => {
    store.dispatch(getCourse(courseTag));
    setTimeout(() => {
      setPage({
        loaded: true
      });
    }, 1000);
    
    console.log( "after page loaded");
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

  const userGotCourse = auth && auth.coursesOwned.filter( (course) => {
    console.log( course._id )
    return course._id == courseId
  });
  console.log( auth && auth.coursesOwned );
  console.log( userGotCourse);
  
  if( payment && payment.addingToCheckout ) {
    console.log( payment.addingToCheckout );
    return <Redirect to="/cart/checkout" />
  }
  console.log("before render");
  console.log(page);
  return (
    <Fragment>
      <SecondHeader />
      
      <div className="courseCtn">
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
                      { auth && auth.isAuthenticated ? 
                        <button className="buyButton" onClick={goCheckout}><span className="buyCoursePrice">Buy Course</span></button>
                        : <button className="buyButton"><Link to="/register" className="buyCoursePrice">Buy Course</Link></button>
                      }
                    </div>
                  </div>
                }
              </div>
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
