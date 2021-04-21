import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activateEmail } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import { RESET_NOTIFICATION } from '../../contants/authConstants';
import {Card} from 'react-bootstrap';
import styles from './Activate.module.css';

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
      dispatch({ type: RESET_NOTIFICATION });
    } else if (!loading && !user) {
      history.push('/');
    }
  }, [user, loading])

  const email = user && user.email;

  const sendEmail = () => {
    dispatch(activateEmail({ email }))
  }

  return (
    <>
      <SecondHeader />
      <div className="container-fluid checkoutSuccessCtn">
        <div className="row">
          <div className="col-12 checkoutSuccess">
            <Card className={styles.cardCtn}>
              <Card.Body>
              <h1>Please confirm Email Address</h1>
              <h4>Check your Email inbox, to activate your account</h4>
              <p>Didn't received your email?</p>
              <button className="btn btn-success" onClick={sendEmail}>Resend Email Activation</button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default Activate;
