import React, { Fragment, useEffect } from 'react';
import store from '../../store';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCourses } from '../../actions/courses';
import SecondHeader from '../partials/SecondHeader';
import './Admin.css'

const Admin = ({ auth, courses }) => {
	console.log(auth);

	useEffect(() => {
    store.dispatch(getCourses());
	}, []);
	
	const images = require.context('../../images/', true);

	const allCourses = courses.all && courses.all.map((course, index) => {
    let img = images(`./${course.tag}.jpg`);
    return (
      <div className="col-3" key={index}>
        <div className="cardBorder">
          <div className="courseThumbnail courseFeatured1">
            <Link to={`/admin/courses/update/${course.tag}`}>
              <img src={img} alt="javascript" />
            </Link>
          </div>
          <div className="courseTitleCtn">
            <Link to={`/admin/courses/update/${course.tag}`}>{course.name}</Link>
          </div>
          <div className="separator"></div>
          <div className="priceCtn">
            <span className="studentNumbers"><i className="fas fa-user"></i> Telmo Sampaio</span><span className="price">${course.price}</span>
          </div>
        </div>
      </div>

    )
  })

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
								<div className="row">
									{allCourses}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

const mapStateToProps = state => ({
	courses: state.courses,
	auth: state.auth
});


export default connect(mapStateToProps)(Admin);
