import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fgt_pass } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import MessageDisplay from '../utils/MessageDisplay';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { notification, loading } = auth;
  
  const [formData, setFormData] = useState({
    email: '',
  });

  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   console.log('reseting the message, in forgotpass');
  //   resetMessage();
  // }, []);

  // useEffect(() => {
  //   setMessage(auth.message);
  // }, [auth.message]);

  const { email } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(fgt_pass({ email }));
    // removeMessage();
  };

  return (
    <Fragment>
      <SecondHeader />
      <div className={styles.forgotPasswordCtn}>
        {/* <h1 className="large text-primary">Forgot Password</h1>
        <p className="lead"><i className="fas fa-user"></i> Please enter your email address</p> */}
        <div className="container">
          <div className="row">
            <Col xs={12} md={{ span: 6, offset: 3 }}>
              <div className={`card ${styles.forgotPasswordCard}`}>
                <h1 className={styles.forgotTitle}>
                  Enter email address
                </h1>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      required
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Reset Password"
                  />
                </form>
                {!loading && notification && notification.message && (
                  <MessageDisplay
                    header="Reset Password"
                    status={notification.status} 
                    message={notification.message}
                  />
                )}
              </div>
              <Col xs={12} className={styles.fgtPasswordButtons}>
							  <Link to="/login">Login</Link>
							  <span className={styles.fgtSeparator}>|</span>
							  <Link to="/register">Register</Link>
						  </Col>
            </Col>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;