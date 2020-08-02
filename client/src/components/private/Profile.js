import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourses } from '../../actions/courses';
import store from '../../store';
import Avatar from '../../images/avatar.png';
import './Profile.css';

function Profile({ auth, active, courses }) {
  
    useEffect( () => {
    //     console.log(auth);
        // console.log(active == 'notActive');
        // console.log(!auth.loading)
        
          store.dispatch(getCourses(auth && auth.user && auth.user.courses));
        // console.log(auth.user.name);
        
        // console.log(auth);
    }, [auth]);

    if(active == 'notActive' && !auth.loading) {
      console.log("inside redirect");
      return <Redirect to="/activate" /> 
    }

    console.log("First");
    return ( 
      <Fragment>
        <SecondHeader />
        <div className="profileCtn">
          <div className="container">
            <div className="row">
              <div className="col-4 userLeftCol">
                <img className="userAvatar" src={Avatar} alt="user avatar"/>
                <h1>{auth && auth.user && auth.user.name}</h1>
                
              </div>
              <div className="col-8 userRightCol">
                <h1>About Me</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam voluptas asperiores omnis? Expedita corrupti, beatae reiciendis possimus ratione autem quos dignissimos provident a ea, veniam hic doloribus, odit atque quia!</p>
                <h1>My Courses</h1>
                <div className="myCoursesCtn">
                  { courses && courses.all && courses.all.map( (course, i) => {
                      return <h1 key={i}>{course.name}</h1>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
};

Profile.propTypes = {
    // getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
    // profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    active: state.auth.active,
    courses: state.courses
});

export default connect(mapStateToProps)(Profile);
