import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import './Admin.css'

const Admin = ({ course, auth }) => {
	console.log(auth);
	return (
		<Fragment>
			<SecondHeader />
			<div className="adminCtn">
				<div className="container">
					<div className="row">
						<div className="col-3 adminSidebar">
							<ul>
								<li>Courses</li>
							</ul>
						</div>
						<div className="col-9">
							<div className="adminCourseTop">
								<h1>Admin</h1>
								<Link to="/admin/courses/create">New Course</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

const mapStateToProps = state => ({
	course: state.courses,
	auth: state.auth
});


export default connect(mapStateToProps)(Admin);
