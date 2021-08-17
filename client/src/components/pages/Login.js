import React, { Fragment, useState, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as styles from './Login.module.css';
import { login } from '../../actions/auth';
import MessageDisplay from '../utils/MessageDisplay';
import { RESET_NOTIFICATION } from '../../contants/authConstants';
import {
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const Login = () => {
	
	const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, notification, active, loading } = auth;

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		showError: false
	});

	const { email, password } = formData;
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value, showError: false });

	useEffect(() => {
    if(notification && notification.status) {
      dispatch({type: RESET_NOTIFICATION, payload: { status: "", message: ""}})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	const onSubmit = async e => {
		e.preventDefault();
		setFormData({
			...formData,
			showError: true
		})
		const token = await executeRecaptcha('submit')
    console.log(token);

		dispatch(login({ email, password, token }));
	}

	const { executeRecaptcha } = useGoogleReCaptcha();

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
											className={styles.loginInput}
											value={email}
											onChange={e => onChange(e)}
											placeholder="Email"
										/>
									</div>
									<div className="form-group">
										<input
											className={styles.loginInput}
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

									{!loading && notification && notification.status === "fail" && formData.showError && (
										
										<MessageDisplay
											header="Authentication Error"
											status={notification.status} 
											message={notification.message}
										/>
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

export default Login;
