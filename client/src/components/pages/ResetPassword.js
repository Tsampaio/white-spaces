import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import { reset_pass } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import MessageDisplay from '../utils/MessageDisplay';
import { RESET_NOTIFICATION } from '../../contants/authConstants';

const ResetPassword = ({history}) => {
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
    formMessage: ''
  });

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, notification, loading } = auth;

  let { token } = useParams();

  useEffect(() => {
    if(notification && notification.status) {
      dispatch({type: RESET_NOTIFICATION, payload: { status: "", message: ""}})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     history.push("/");
  //   } else if(message === 'Password reseted') {
  //     setTimeout(() => {
  //       return <Redirect to="/profile" />
  //     }, 3000);
  //   }
    
  // }, [isAuthenticated, message])

  const { password, passwordConfirm, formMessage } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, showError: false, formMessage: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setFormData({ ...formData, formMessage: 'Passwords are not the same' });
    } else {
      dispatch(reset_pass({ password, passwordConfirm, token }));
      setFormData({ ...formData, password: '', passwordConfirm: '', formMessage: '' });
    }

  }
  console.log("My token frontend is " + token);

  // if (isAuthenticated) {
  //   return <Redirect to="/" />
  // } else if(message === 'Password reseted') {
  //   setTimeout(() => {
  //     return <Redirect to="/profile" />
  //   }, 3000);
  // }

  return (
    <>
       <SecondHeader />
      {/*<div className="forgotPasswordCtn">
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card forgotPasswordCard">
                <h1 className="loginTitle"><i className="fas fa-user"></i> Please! enter your new password</h1>
                
                <form className="form" onSubmit={e => onSubmit(e)}>
                  <div className="form-group">
                    <input type="password" placeholder="Password" name="password" required onChange={e => onChange(e)} />
                  </div>
                  <div className="form-group">
                    <input type="password" placeholder="Confirm Password" name="passwordConfirm" required onChange={e => onChange(e)} />
                  </div>
                  <input type="submit" className="btn btn-success" value="Update Password" />
                </form>
                {error && (
                  <h1 className="passwordUpdateMessage">{error}</h1>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.forgotPasswordCtn}>
				<Container>
					<Row>
						<Col xs={12} md={{ span: 6, offset: 3 }}>
							<div className={`card ${styles.forgotPasswordCard}`}>
								<h1 className={styles.forgotPasswordTitle}>Welcome back</h1>
								<p>Please enter your new password</p>
								<form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
										<input
											type="password"
											name="password"
											minLength="6"
											value={password}
											onChange={e => onChange(e)}
											required
											placeholder="Password"
										/>
									</div>
									<div className="form-group">
										<input
											type="password"
											name="passwordConfirm"
											minLength="6"
											value={passwordConfirm}
											onChange={e => onChange(e)}
											required
											placeholder="Confirm Password"
										/>
									</div>
									<input type="submit" className="btn btn-primary" value="Update Password" />

									{!loading && notification && notification.status && (
										
										<MessageDisplay
											header={notification.status === 'fail' ? 'Error' : 'Password Update Success'}
											status={notification.status} 
											message={notification.message}
										/>
									)}
                  {!loading && formMessage && (
                  <MessageDisplay 
                    header="Error"
                    status="fail" 
                    message={formMessage} 
                  />
                )}
								</form>
							</div>
						</Col>
				  </Row>
			  </Container>
		  </div>
    </>
  )
}

export default ResetPassword;