import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { getCourses } from '../../actions/courses';
import SecondHeader from '../partials/SecondHeader';
import './Courses.css'

const Courses = () => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const courses = useSelector(state => state.courses);

	useEffect(() => {
		dispatch(getCourses());
	}, []);

	const images = require.context('../../images/courses', true);

	const allCourses = courses.all && courses.all.map((course, index) => {

		let img = "";
		if (course && course.hasThumbnail) {
			img = images(`./${course.tag}.jpg`);
		} else {
			img = images(`./default-course.jpg`);
		}

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

	if (auth && auth.user && auth.user.role !== "admin") {
		return <Redirect to="/" />
	}

	return (
		<>
			<div className="adminCtn">
				<div className="container-fluid">
					<div className="row">
						<div className="col-10">
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
		</>
	)
}

export default Courses;
