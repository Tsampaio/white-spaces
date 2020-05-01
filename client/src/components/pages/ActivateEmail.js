import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { activateEmailAction } from '../../actions/auth';

const ActivateEmail = ({ message, activateEmailAction, active }) => {
  const { token } = useParams();
  
  console.log("This is my token " + token);
  useEffect( () => {
    activateEmailAction(token);
    console.log(message);
  });

  if(active) {
    return <Redirect to="/" /> 
  }

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

const mapStateToProps = state => ({
  message: state.auth.message,
  active: state.auth.active
})

export default connect(mapStateToProps, {activateEmailAction})(ActivateEmail);
