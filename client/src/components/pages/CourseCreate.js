import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import './Admin.css'

const CourseCreate = ({ course, auth }) => {
	console.log(auth);

	const [courseState, setCourseState] = useState({
		courseName: "",
		courseIntro: "",
		courseTag: "",
		courseDescription: "",
		coursePrice: "",
		classes: [ {
			lecture: "",
			title: "",
			url: "",
			duration: 0
		}],
	});

	const addClass = () => {
		setCourseState({
			...courseState,
			classes: [ ...courseState.classes, {
				lecture: "",
				title: "",
				url: "",
				duration: 0
			} ]
		});
	}

	const updateClass = (e) => {
		
		const index = e.target.parentElement.firstChild.value;
    console.log("current index is " + index);
		const stateRef = courseState;

		stateRef.classes[index][e.target.name] = e.target.value;
		setCourseState(stateRef);
	}
		
	const allClasses = courseState.classes.map( (theClass, i) => {
		let name = `courseClass${i + 1}`;
		let placeholder= `Class ${i + 1} Url`;
		return (
			<div>
				<input type="hidden" value={i}/>
				<input type="text" name="lecture" placeholder="lecture" onChange={  updateClass }/>
				<input type="text" name="title" placeholder="title" onChange={  updateClass }/>
				<input type="text" name="url" placeholder="url" onChange={  updateClass }/>
				<input type="text" name="duration" placeholder="duration" onChange={  updateClass }/>
			</div>
		)
	});

	

	console.log( courseState )

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
							<div>
								<h1>Create your Course</h1>
								<label>Name</label><input required type="text" name="courseName"/><br/>
								<label>Course Intro</label><input required type="text" name="courseIntro"/><br/>
								<label>Course Tag</label><input required type="text" name="courseTag"/><br/>
								<label>Course Description</label><input required type="text" name="courseDescription"/><br/>
								<label>Course Price</label><input required type="text" name="coursePrice"/><br/>
								<label>Course Classes</label>
								{allClasses}
								<button onClick={addClass}>Add Class</button>
								<button>Create Course</button>
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


export default connect(mapStateToProps)(CourseCreate);
