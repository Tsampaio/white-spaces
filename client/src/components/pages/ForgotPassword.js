import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fgt_pass, resetMessage } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import './ForgotPassword.css';

const ForgotPassword = ({ fgt_pass, resetMessage, auth }) => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [message, setMessage] = useState("")

  useEffect(() => {
    console.log("reseting the message, in forgotpass");
    resetMessage();
    
  }, []);

  useEffect(() => {
    setMessage(auth.message);
    
  }, [auth.message]);

  const { email } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    fgt_pass({ email });
    // removeMessage();
    
  }

  // const removeMessage = () => {
  //   setTimeout(()=> {
  //     setMessage("");
  //   }, 7000);
  // }

  console.log(message);
  return (
    <Fragment>
      <SecondHeader />
      <div className="forgotPasswordCtn">
        {/* <h1 className="large text-primary">Forgot Password</h1>
        <p className="lead"><i className="fas fa-user"></i> Please enter your email address</p> */}
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card forgotPasswordCard">
                <h1 className="loginTitle"><i className="fas fa-envelope"></i>Please enter your email address</h1>
                <form className="form" onSubmit={e => onSubmit(e)}>
                  <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" required onChange={e => onChange(e)} />
                  </div>
                  <input type="submit" className="btn btn-success" value="Reset Password" />
                </form>
                <h1 className="forgotPasswordMessage">{message}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { fgt_pass, resetMessage })(ForgotPassword);