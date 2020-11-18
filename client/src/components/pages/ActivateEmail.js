import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { activateEmailAction } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import Loader from '../utils/Loader';

const ActivateEmail = ({ history }) => {
  const { token } = useParams();

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { user, message, active, loading } = auth;

  console.log("This is my token " + token);
  useEffect(() => {
    console.log("This is My Message+++++");
    console.log(message);
    dispatch(activateEmailAction(token));
  }, []);

  useEffect(() => {
    console.log("current message is");
    console.log(message);
  }, [message]);

  return (
    <>
      <SecondHeader />
      <div className="container checkoutSuccessCtn">
        <div className="row">
          <div className="col-12 checkoutSuccess">
            <h1>{message}</h1>
            {loading ? <Loader /> : message === "You are Activated" ? (
              <Link to='/courses' className='btn btn-success'>Start learning</Link>
            ) : (
                <Link to='/activate' className='btn btn-success'>Activate account</Link>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivateEmail;
