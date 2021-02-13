import React, { Fragment, useState, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import * as styles from './Login.module.css';
import { login, resetMessage } from '../../actions/auth';
import PropTypes from 'prop-types';

const Login = ({ login, resetMessage, isAuthenticated, auth, active }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const [message, setMessage] = useState("")

	useEffect(() => {
		resetMessage();
	}, []);

	useEffect(() => {
		setMessage(auth.message);
	}, [auth.message])

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
			<div className={styles.loginCtn}>
				<div className="container">
					<div className="row">
						<Col xs={12} md={{ span: 6, offset: 3 }}>
							<div className={`card ${styles.loginCard}`}>
								<h1 className={styles.loginTitle}>Welcome back</h1>
								<p>Log in with your email address</p>
								<form className="form" onSubmit={e => onSubmit(e)}>
									<div className="form-group">
										
										<input type="email" name="email" required
											value={email}
											onChange={e => onChange(e)}
											placeholder="Email"
										/>
									</div>
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
									<input type="submit" className="btn btn-primary" value="Login" />

									{message && (
										<div className={styles.loginError}>
											<h1>{message}</h1>
										</div>
									)}
								</form>

							</div>
						</Col>
						<Col xs={12} className={styles.loginExtraButtons}>
								<Link to="/forgotPassword">Forgot Password?</Link>
								<span className={styles.loginSeparator}>|</span>
								<Link to="/register">Register</Link>
						</Col>
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
	isAuthenticated: state.auth.isAuthenticated,
	auth: state.auth
})

export default connect(mapStateToProps, { login, resetMessage })(Login);
