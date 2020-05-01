import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function Profile({ auth, active }) {
    const [state, setState] = useState({
        name: ''
    })

    useEffect( () => {
        console.log(auth);
        if( auth.user) {
            setState({ name: auth.user.name });
            // console.log(auth.user.name);
        } else if(active == 'notActive') {
          return <Redirect to="/login" /> 
        }
        console.log("Last");
    }, [auth]);

    console.log("First");
    return ( 
        <Fragment>
          <h1> Welcome {state.name}</h1>
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
