import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { activateEmailAction } from '../../actions/auth';

const ActivateEmail = ({history}) => {
  const { token } = useParams();

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { message, active } = auth;

  console.log("This is my token " + token);
  useEffect( () => {
    console.log(message);

    if (active == 'notActive' && !auth.loading) {
      dispatch(activateEmailAction(token));
      
    } else if (auth && !auth.isAuthenticated && !auth.loading) {
      history.push("/");
    }
  }, [auth, active]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default ActivateEmail;
