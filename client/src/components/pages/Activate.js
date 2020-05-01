import React, {useState} from 'react';
import { connect} from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { activateEmail } from '../../actions/auth';

const Activate = ({isAuthenticated, user, message}) => {
  
  if( !isAuthenticated ) {
    return <Redirect to="/" /> 
  }

  const email = user.email

  return (
    <div>
      <h1>Please confirm Email Address</h1>
      <button className="btn btn-success" onClick={activateEmail({email})}>Resend Email Activation</button>
      {message && (
        <h1>{message}</h1>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  message: state.auth.message
})

export default connect(mapStateToProps)(Activate);
