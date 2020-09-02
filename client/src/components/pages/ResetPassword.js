import React, { Fragment, useState } from 'react';
import { connect} from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import { reset_pass } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';

const ResetPassword = ({ reset_pass, message, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
    error: ''
  });

  let { token } = useParams();

  const { password, passwordConfirm, error } = formData;
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if( password !== passwordConfirm ) {
      setFormData({ ...formData, error: 'Passwords are not the same' });
    } else {
      reset_pass({ password, passwordConfirm, token });
    }
		
  }
  console.log("My token frontend is " + token);
  
  if( isAuthenticated ) {
    return <Redirect to="/" /> 
  }

  return (
    <Fragment>
      <SecondHeader />
			<h1 className="large text-primary">Update Password</h1>
			<p className="lead"><i className="fas fa-user"></i> Please enter your new password</p>
			<form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="password" placeholder="Password" name="password" required onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirm Password" name="passwordConfirm" required onChange={e => onChange(e)}/>
        </div>
				<input type="submit" className="btn btn-primary" value="Update Password" />
			</form>
      {error && (
        <h1>{error}</h1>
      )}
      {message && (
        <h1>{message}</h1>
      )}
		</Fragment>
  )
}

const mapStateToProps = state => ({
  message: state.auth.message,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { reset_pass })(ResetPassword);