import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { useParams, Link } from 'react-router-dom';
import SecondHeader from '../partials/SecondHeader';
import { getCourse } from '../../actions/courses';
import './Admin.css'

const CourseUpdate = ({ course, auth }) => {
	console.log(auth);

	const [courseState, setCourseState] = useState({
		courseName: "",
		courseIntro: "",
		courseTag: "",
		courseDescription: " ",
		coursePrice: "",
		classes: [ {
			lecture: "",
			title: "",
			url: "",
			duration: 0
		}],
		loaded: false
	});

	const { courseTag } = useParams();

	useEffect( () => {
		setCourseValues();
	}, [courseState.loaded]);
	
	const setCourseValues = async () => {
		await store.dispatch(getCourse(courseTag));
		setCourseState({
			...courseState,
			courseName: course && course.data && course.data.name,
			courseDescription: course && course.data && course.data.description,
			loaded: true
		})
	}

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

	const updateCourse = (e) => {
		setCourseState({
			...courseState,
			[e.target.name]: e.target.value
		})
	}

	const updateClass = (e) => {
		
		const index = e.target.parentElement.firstChild.value;
    console.log("current index is " + index);
		const stateRef = { ...courseState };

		stateRef.classes[index][e.target.name] = e.target.value;
		setCourseState(stateRef);
	}
		
	const allClasses = courseState.classes.map( (theClass, i) => {
	
		return (
			<div key={i}>
				<input type="hidden" value={i}/>
				<input type="text" name="lecture" placeholder="lecture" onChange={updateClass} value={courseState.classes[i].lecture}/>
				<input type="text" name="title" placeholder="title" onChange={  updateClass } value={courseState.classes[i].title}/>
				<input type="text" name="url" placeholder="url" onChange={  updateClass } value={courseState.classes[i].url}/>
				<input type="text" name="duration" placeholder="duration" onChange={  updateClass } value={courseState.classes[i].duration}/>
			</div>
		)
	});

	// console.log( course )
	console.log(courseState);

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
								<h1>Update the Course</h1>
								<label>Name</label><input required type="text" name="courseName" onChange={updateCourse} value={courseState.courseName}/><br/>
								<label>Course Intro</label><input required type="text" name="courseIntro" onChange={updateCourse}/><br/>
								<label>Course Tag</label><input required type="text" name="courseTag" onChange={updateCourse}/><br/>
								
								<label>Course Description</label><br/>
								<textarea required type="text" name="courseDescription" onChange={updateCourse} rows="15" cols="80" value={courseState.courseDescription} /><br/>
								<label>Course Price</label><input required type="text" name="coursePrice" onChange={updateCourse}/><br/>
								<label>Course Classes</label>
								{allClasses}
								<button onClick={addClass}>Add Class</button>
								<button >Create Course</button>
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


export default connect(mapStateToProps)(CourseUpdate);


