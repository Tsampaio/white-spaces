import React, { Fragment, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { useParams, Link, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse } from '../../actions/courses';
import { addCheckout, getCoursesOwned } from '../../actions/courses';
import SecondHeader from '../partials/SecondHeader';
import './Course.css';

const Course = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, membership, token } = auth;
  const course = useSelector((state) => state.courses);
  const payment = useSelector((state) => state.payment);
  console.log(course);

  const [page, setPage] = useState({
    loaded: false,
  });

  const { courseTag } = useParams();

  useEffect(() => {
    console.log("getting course");
    dispatch(getCourse(courseTag, user && user._id));
  }, [courseTag, dispatch, user, token]);

  useEffect(() => {
    dispatch(getCoursesOwned(user && user._id));
    setPage({ loaded: true });
    console.log('after page loaded');
  }, [dispatch, user]);

  useEffect(() => {
    if (membership && membership.active) {
      setPage({ loaded: true });
    }
  }, [membership]);

  // useEffect(() => {
  //   store.dispatch(getCourse(courseTag, auth && auth.token));
  // }, [auth && auth.token])

  console.log(courseTag);
  console.log(course);
  console.log(auth);
  const description = () => {
    if (course && course.data && course.data.description) {
      return course.data.description;
    } else {
      return '';
    }
  };

  const goCheckout = async () => {
    const selectedCourse = course && course.data;
    const userEmail = auth && auth.user && auth.user.email;
    await dispatch(addCheckout({ selectedCourse, userEmail }));
  };

  let classes =
    course &&
    course.data &&
    course.data.classes.map((theClass, i) => {
      return (
        <div
          className={
            i % 2 == 0 ? 'courseClassItems bg-light' : 'courseClassItems'
          }
          key={i}
        >
          <div className="courseClassLecture">
            <i className="far fa-file"></i><span className="d-none d-sm-block">Lecture</span> {theClass.lecture}
          </div>
          <div className="courseClassTitle">
            <Link to={`/courses/${course.data.tag}/lessons/1`}>
              {theClass.title}
            </Link>
            <span className="d-none d-sm-block">{theClass.duration} min</span>
          </div>
        </div>
      );
    });

  const courseId = course && course.data && course.data._id;

  const userGotCourse =
    auth && auth.coursesOwned &&
    auth.coursesOwned.filter((course) => {
      console.log(course._id);
      console.log(courseId);
      return course._id == courseId;
    });
  console.log(auth && auth.coursesOwned);
  console.log(userGotCourse);

  if (payment && payment.addingToCheckout) {
    console.log(payment.addingToCheckout);
    return <Redirect to="/cart/checkout" />;
  }

  if (membership && membership.active) {
    console.log('final check');
  }

  return (
    <Fragment>
      <SecondHeader />

      <div className="courseCtn">
        <div className="container">
          <div className="courseCtnHeader">
            <h1 className="coursePageTitle">
              {course && course.data && course.data.name}
            </h1>
            {(userGotCourse && userGotCourse.length > 0) ||
            (membership && membership.active) ? (
              <Button variant="dark" className="removePadding">
                <Link
                  className="btnStart"
                  to={`/courses/${
                    course && course.data && course.data.tag
                  }/lessons/1`}
                >
                  <span className="buyCoursePrice">Start Learning</span>
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="courseCtnBody">
            <div className="courseIntro">
              <iframe
                src={course && course.data && course.data.intro}
                width="640"
                height="360"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="courseIntro"
              ></iframe>
            </div>
            <div className="row">
              <div className={membership && membership.active && userGotCourse && userGotCourse.length > 0 ? "col-lg-12 col-sm-12" : "col-lg-8 col-sm-12"}col-lg-8 col-sm-12>
                <div className="card">
                  <div className="card-header">Description</div>
                  <div className="courseDescription card-body">
                    {parse(description())}
                  </div>
                </div>

                <div className="curriculumCtn card">
                  <div className="card-body">
                    <h4 className="courseOverview">Curriculum</h4>
                    {classes}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 offset-sm-2 offset-lg-0 col-sm-8">
                {page.loaded &&
                membership &&
                membership.active ? null : (
                  <div className="card purchaseButtons membershipCardCtn">
                    <div className="card-header">
                      Unlimited access all courses
                    </div>
                    <div className="card-body">
                      <h1>$18/month</h1>
                      <Link
                        className="membershipPay"
                        id="membershipButton"
                        to="/membership"
                      >
                        {' '}
                        <span className="buyMembershipPrice">
                          Buy Membership
                        </span>
                      </Link>
                    </div>
                  </div>
                )}

                {(!userGotCourse || (userGotCourse && userGotCourse.length < 1)) && (
                  <div className="card purchaseButtons">
                    <div className="card-header">Buy Lifetime Access:</div>
                    <div className="card-body">
                      <h1>${course && course.data && course.data.price} USD</h1>
                      <Link to="/cart/checkout"></Link>
                      {auth && auth.isAuthenticated ? (
                        <button
                          className="membershipPay buyLifetime"
                          onClick={goCheckout}
                        >
                          <span className="buyCoursePrice">Buy Course</span>
                        </button>
                      ) : (
                        <Link to="/register" className="membershipPay btn-primary buyLifetime">
                          Buy Course
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Course;
