import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';
import { logout } from '../../actions/auth';

const Logout =  ({ history }) => {

  useEffect( () => {
    store.dispatch(logout());
    history.push('/');
  }, []);

  // if(!isAuthenticated) {
  //   return <Redirect to="/" /> 
  // }
  return (
    <h1>Logout</h1>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Logout);