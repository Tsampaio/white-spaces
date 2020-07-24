import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '../../images/avatar.png';
import './Profile.css';

function Profile({ auth, active }) {
    const [state, setState] = useState({
        name: ''
    })

    useEffect( () => {
    //     console.log(auth);
        // console.log(active == 'notActive');
        // console.log(!auth.loading)
        if(auth.user) {
          setState({ name: auth.user.name });
        }
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
                <h1>{state.name}</h1>
                
              </div>
              <div className="col-8 userRightCol">
                <h1>About Me</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam voluptas asperiores omnis? Expedita corrupti, beatae reiciendis possimus ratione autem quos dignissimos provident a ea, veniam hic doloribus, odit atque quia!</p>
                <h1>My Courses</h1>
                <div className="myCoursesCtn">
                  { auth && auth.users && auth.users.courses}
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
    active: state.auth.active
    // profile: state.profile
});

export default connect(mapStateToProps)(Profile);
