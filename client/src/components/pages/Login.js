import React, { Fragment, useState } from 'react';
import { connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated, active }) => {
	const [formData, setFormData] = useState({
			email: '',
			password: ''
	});

	const { email, password } = formData;
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async e => {
		e.preventDefault();
		login({ email, password });
	}

	//Redirect if logged in
	if( isAuthenticated && active === "notActive" ) {
		return <Redirect to="/activate" /> 
	} else if( isAuthenticated ) {
			return <Redirect to="/" /> 
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
			<form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" required
              value={email}
              onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={e => onChange(e)}
          />
        </div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<h3><Link to="/forgotPassword">Forgot your password?</Link></h3>
		</Fragment>
	);
}

Login.propTypes = {
    // setAlert: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
