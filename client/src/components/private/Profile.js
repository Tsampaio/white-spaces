import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function Profile({ auth }) {

    let name ='';
    console.log(auth);
    if( auth.user) {
        name = auth.user.name;
        // console.log(auth.user.name);
    } else {
      return <Redirect to="/login" /> 
    }
    return ( 
        <Fragment>
          <h1> Welcome {name}</h1>
        </Fragment>
    );
};

Profile.propTypes = {
    // getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
    // profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
    // profile: state.profile
});

export default connect(mapStateToProps)(Profile);
