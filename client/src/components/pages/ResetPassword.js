import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import { reset_pass } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import './ResetPassword.css';

const ResetPassword = ({history}) => {
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
    error: ''
  });

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { message, isAuthenticated } = auth;

  let { token } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/");
    } else if(message === 'Password reseted') {
      setTimeout(() => {
        return <Redirect to="/profile" />
      }, 3000);
    }
    
  }, [isAuthenticated, message])

  const { password, passwordConfirm, error } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setFormData({ ...formData, error: 'Passwords are not the same' });
    } else {
      dispatch(reset_pass({ password, passwordConfirm, token }));
      setFormData({ ...formData, error: '' });
    }

  }
  console.log("My token frontend is " + token);

  if (isAuthenticated) {
    return <Redirect to="/" />
  } else if(message === 'Password reseted') {
    setTimeout(() => {
      return <Redirect to="/profile" />
    }, 3000);
  }

  return (
    <>
      <SecondHeader />
      <div className="forgotPasswordCtn">
        {/* <h1 className="large text-primary">Forgot Password</h1>
        <p className="lead"><i className="fas fa-user"></i> Please enter your email address</p> */}
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card forgotPasswordCard">
                <h1 className="loginTitle"><i className="fas fa-user"></i> Please enter your new password</h1>
                
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
                {message && (
                  <h1 className="passwordUpdateMessage">{message}</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  message: state.auth.message,
  isAuthenticated: state.auth.isAuthenticated
});

export default ResetPassword;