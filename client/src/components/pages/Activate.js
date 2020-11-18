import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activateEmail } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import { RESET_MESSAGE } from '../../contants/authConstants';
const Activate = ({ history }) => {

  // if (!isAuthenticated) {
  //   return <Redirect to="/" />
  // }
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, user, message, loading } = auth;

  // useEffect(() => {
  //   if(!isAuthenticated && !loading ) {
  //     history.push('/');
  //   }
  // }, [isAuthenticated, loading])

  useEffect(() => {
    if(user && !loading) {
      dispatch({ type: RESET_MESSAGE });
    } else {
      history.push('/');
    }
  }, [])

  const email = user && user.email;

  const sendEmail = () => {
    dispatch(activateEmail({ email }))
  }

  return (
    <>
      <SecondHeader />
      <div className="container checkoutSuccessCtn">
        <div className="row">
          <div className="col-12 checkoutSuccess">
            <h1>Please confirm Email Address</h1>
            <h4>To activate your account</h4>
            <button className="btn btn-success" onClick={sendEmail}>Resend Email Activation</button>
            {message && (
              <h5>{message}</h5>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Activate;
