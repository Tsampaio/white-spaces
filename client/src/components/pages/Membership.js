import React, { Fragment, useState, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import './Membership.css';

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
		if (message) {
			setTimeout(() => {
				// resetMessage();
				console.log("message deleted");
				setFormData({ ...formData, message: "" });
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
			<div className="membershipCtn">
				<div className="container">
					<div className="row">
						<div className="col-lg-5 offset-lg-1 col-md-10 offset-md-1">
							<div className="annualCtn">
								<h2 className="membershipRecommended">MOST POPULAR</h2>
								<h3 className="membershipTitle">Annual</h3>
								<h1 className="membershipPrice">
									<span className="membershipDollar">$</span>
									<span className="membershipPriceValue">9<span>.99</span></span>
									<span>/month</span>
								</h1>
								<div>
									<span className="membershipPriceToPay">$120.00</span>
									<span className="membershipBilled">BILLED YEARLY</span>
								</div>
								<ul className="membershipFeatures">
									<li><i className="fa fa-check"></i>Access all courses from Library</li>
									<li><i className="fa fa-check"></i>New courses every month</li>
									<li><i className="fa fa-check"></i>Cancel at any time</li>
									<li><i className="fa fa-check"></i>Download courses project files</li>
									<li><i className="fa fa-check"></i>30% Discount in all courses</li>
								</ul>
								<Link className="membershipBuyButton" to="/membership/annual">Start Plan</Link>
							</div>

						</div>
						<div className="col-lg-5 col-md-10 offset-md-1">
							<div className="monthlyCtn">
								<h3 className="membershipTitle">Monthly</h3>
								<h1 className="membershipPrice">
									<span className="membershipDollar">$</span>
									<span className="membershipPriceValue">24<span>.99</span></span>
									<span>/Month</span>
								</h1>
								
								<ul className="membershipFeatures">
									<li><i className="fa fa-check"></i>Access all courses from Library</li>
									<li><i className="fa fa-check"></i>New courses every month</li>
									<li><i className="fa fa-check"></i>Cancel at any time</li>
									<li><i className="fa fa-times"></i><span style={{textDecoration: "line-through"}}>Download courses project files</span></li>
									<li><i className="fa fa-times"></i><span style={{textDecoration: "line-through"}}>30% Discount in all courses</span></li>
								</ul>
								<Link className="membershipBuyButton" to="/membership/monthly">Start Plan</Link>
							</div>
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
