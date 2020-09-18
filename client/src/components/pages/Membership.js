import React, { Fragment, useState, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import './Register.css';

const Membership = ({ register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
		randNumber1: Math.floor(Math.random() * 10 + 1),
		randNumber2: Math.floor(Math.random() * 10 + 1),
		message: '',
		result: 0
	});
	const { name, email, password, passwordConfirm, randNumber1, randNumber2, message, result } = formData;

	useEffect(() => {
		if( message ) {
			setTimeout( () => {
				// resetMessage();
				console.log("message deleted");
				setFormData({ ...formData, message: ""});
			}, 5000);
		}
	}, [message])

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async e => {
		e.preventDefault();
		console.log("Inside register")
		if (password !== passwordConfirm) {
			// setAlert("Passwords do not match", 'danger', 3000);
			console.log("passwords")
			setFormData({ ...formData, message: "Passwords do not match" });
		} else if ((randNumber1 + randNumber2) !== parseInt(result)) {
			console.log("results")
			console.log("Random Number 1", randNumber1);
			console.log(typeof randNumber1);
			console.log("Random Number 2", randNumber2);
			console.log("Result", result);
			console.log(randNumber1 === result);
			console.log(randNumber1 !== result);
			setFormData({ ...formData, message: "You are a robot!" });


		} else {
			console.log("Inside register action")
			register({ name, email, password, passwordConfirm });
		}
	}

	const checkResult = (e) => {
		setFormData({ ...formData, result: e.target.value })
	}

	//Redirect if logged in
	// if (isAuthenticated) {
	// 	return <Redirect to="/" />
	// }
	console.log(result);
	console.log(randNumber1)
	console.log(randNumber2)
	return (
		<Fragment>
			<SecondHeader />
			<div className="registerCtn">
				<div className="container">
					<div className="row">
						<div className="col-6 offset-3">
							<h3>Most Popular</h3>
							<h2>Annual Plan</h2>
							<Link to="/membership/monthly">Buy Now</Link>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}


const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { register })(Membership);
