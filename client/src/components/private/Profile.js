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
        console.log(auth);
        if( auth.user) {
            setState({ name: auth.user.name });
            // console.log(auth.user.name);
        } else if(active == 'notActive' && !auth.loading) {
          return <Redirect to="/activate" /> 
        }
        // console.log("Last");
    }, [auth]);

    console.log("First");
    return ( 
      <Fragment>
        <SecondHeader />
        <div className="profileCtn">
          <div className="container">
            <div className="row">
              <div className="col-4 userLeftCol">
                <img class="userAvatar" src={Avatar} alt="user avatar"/>
                <h1>{state.name}</h1>
                <h5>Courses Owned</h5>
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
