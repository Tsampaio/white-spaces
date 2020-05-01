import React, { Fragment, useState } from 'react';
import { connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fgt_pass } from '../../actions/auth';

const ForgotPassword = ({ fgt_pass, emailSent }) => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const { email } = formData;
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
		fgt_pass({ email });
  }

  if( emailSent ) {
    return <Redirect to="/" /> 
  }

  return (
    <Fragment>
			<h1 className="large text-primary">Forgot Password</h1>
			<p className="lead"><i className="fas fa-user"></i> Please enter your email address</p>
			<form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" required onChange={e => onChange(e)}/>
        </div>
				<input type="submit" className="btn btn-primary" value="Reset Password" />
			</form>
		</Fragment>
  )
}

const mapStateToProps = state => ({
  emailSent: state.auth.emailSent
})

export default connect(mapStateToProps, { fgt_pass })(ForgotPassword);