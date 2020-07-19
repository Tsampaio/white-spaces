import React, { Fragment, useState } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import './Login.css'
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
	if (isAuthenticated && active === "notActive") {
		return <Redirect to="/activate" />
	} else if (isAuthenticated) {
		return <Redirect to="/" />
	}

	return (
		<Fragment>
		<SecondHeader />
		<div className="loginCtn">
			<div className="container">
				<div className="row">
					<div className="col-8 offset-2">
						<div className="card">
							<h1 className="loginTitle"><i className="fas fa-user"></i>Login to Telmo Academy</h1>
							<form className="form" onSubmit={e => onSubmit(e)}>
								<div className="form-group">
									<label>Email Address</label><br />
									<input type="email" name="email" required
										value={email}
										onChange={e => onChange(e)}
									/>
								</div>
								<div className="form-group">
									<label>Password</label><br />
									<input
										type="password"
										name="password"
										minLength="6"
										value={password}
										onChange={e => onChange(e)}
									/>
								</div>
								<input type="submit" className="btn btn-primary" value="Login" />
							</form>

						</div>
					</div>
					<div className="col-4 offset-2">
						<div className="card">

							<h3><Link to="/forgotPassword">Forgot your password?</Link></h3>


						</div>

					</div>
					<div className="col-4">
						<div className="card">
							<h3><Link to="/forgotPassword">Create an Account</Link></h3>
						</div>
					</div>
				</div>
			</div>
		</div>
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
