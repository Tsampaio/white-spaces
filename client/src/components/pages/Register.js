import React, { Fragment, useState } from 'react';
import { connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
			name: '',
			email: '',
			password: '',
			passwordConfirm: ''
	});

	const { name, email, password, passwordConfirm } = formData;
	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async e => {
		e.preventDefault();
		if(password !== passwordConfirm) {
				// setAlert("Passwords do not match", 'danger', 3000);
				alert("Passwords do not match");
		} else {
				register({ name, email, password, passwordConfirm });
		}
	}

	//Redirect if logged in
	if( isAuthenticated ) {
			return <Redirect to="/" /> 
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
			<form className="form" onSubmit={e => onSubmit(e)}>
					<div className="form-group">
					<input type="text" placeholder="Name" name="name" required 
							value={name}
							onChange={e => onChange(e)}
					/>
					</div>
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
					<div className="form-group">
					<input
							type="password"
							placeholder="Confirm Password"
							name="passwordConfirm"
							minLength="6"
							value={passwordConfirm}
							onChange={e => onChange(e)}
					/>
					</div>
					<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
					Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
}

Register.propTypes = {
    // setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { register })(Register);
