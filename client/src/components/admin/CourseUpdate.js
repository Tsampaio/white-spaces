import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../actions/courses';
import { updateCourseAction, deleteVideoClassAction } from '../../actions/courses';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { stateFromHTML } from 'draft-js-import-html';

import './Admin.css';
import './CourseUpdate.css';

const CourseUpdate = ({ course, auth, updateCourseAction, deleteVideoClassAction }) => {
	console.log(auth);

	const [courseState, setCourseState] = useState({
		id: "",
		courseName: "",
		courseIntro: "",
		courseTag: "",
		courseDescription: " ",
		coursePrice: "",
		classes: [{
			id: "",
			lecture: "",
			title: "",
			url: "",
			duration: 0
		}],
		loaded: false
	});

	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [saveCourse, setSaveCourse] = useState(false);

	const { courseTag } = useParams();

	useEffect(() => {
		setCourseValues();

	}, [courseState.loaded, course.loading]);

	useEffect(() => {
		if (courseState.courseDescription) {
			setEditorState(EditorState.createWithContent(stateFromHTML(courseState.courseDescription)))
		}
	}, [courseState.courseDescription]);

	useEffect(() => {
		if(saveCourse) {
			updateCourseAction(courseState);
		}
	}, [saveCourse])

	const setCourseValues = async () => {
		await store.dispatch(getCourse(courseTag));

		// if (course && course.data && course.data._id) {
		// 	for (let i = 0; i < course.data.classes.length; i++) {
		// 		delete course.data.classes[i]._id
		// 	}
		// }

		setCourseState({
			...courseState,
			id: course && course.data && course.data._id,
			courseName: course && course.data && course.data.name,
			courseIntro: course && course.data && course.data.intro,
			courseTag: course && course.data && course.data.tag,
			courseDescription: course && course.data && course.data.description,
			coursePrice: parseInt(course && course.data && course.data.price),
			classes: course && course.data && course.data.classes,
			loaded: true
		})
	}

	const addClass = () => {
		setCourseState({
			...courseState,
			classes: [...courseState.classes, {
				lecture: "",
				title: "",
				url: "",
				duration: 0
			}]
		});
	}

	const updateCourse = (e) => {
		setCourseState({
			...courseState,
			[e.target.name]: e.target.value
		})
	}

	const updateClass = (e) => {

		const index = e.target.parentElement.parentElement.firstChild.value;
		console.log("current index is " + index);
		const stateRef = { ...courseState };
		console.log(e.target.value);
		if (e.target.name === ("duration" || "lecture")) {
			stateRef.classes[index][e.target.name] = parseInt(e.target.value);
		} else {
			stateRef.classes[index][e.target.name] = e.target.value;
		}
		setCourseState(stateRef);
	}

	const allClasses = courseState.classes && courseState.classes.length > 0 && courseState.classes.map((theClass, i) => {

		return (
			<div key={i} className="card singleClassCtn">
				<input type="hidden" value={i} />
				<div className="card-body">
					<label htmlFor="classNumber" className="col-2">Class Number</label>
					<input id="classNumber" type="number" name="lecture" placeholder="lecture" onChange={updateClass} value={courseState.classes[i].lecture} />
				</div>
				<div className="card-body">
					<label htmlFor="classTitle" className="col-2">Class Title</label>
					<input id="classTitle" type="text" name="title" placeholder="title" onChange={updateClass} value={courseState.classes[i].title} size="50"/>
				</div>
				<div className="card-body">
					<label htmlFor="classVideoUrl" className="col-2">Class Video Url</label>
					<input id="classVideoDuration" type="text" name="url" placeholder="url" onChange={updateClass} value={courseState.classes[i].url} size="50"/>
				</div>
				<div className="card-body">
					<label htmlFor="classVideoDuration" className="col-2">Class Video Duration</label>
					<input id="classVideoDuration" type="number" name="duration" placeholder="duration" onChange={updateClass} value={courseState.classes[i].duration} />
				</div>
				<div className="card-body">
					<button onClick={() => deleteVideoClassAction(courseState.id, courseState.classes[i]._id)}><i class="fas fa-trash-alt"></i> Delete Video</button>
					
				</div>
			</div>
			// value={courseState.classes[i].lecture}
		)
	});

	console.log(course)
	console.log(courseState);

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState);
		// setCourseState({
		// 	...courseState,
		// 	courseDescription: draftToHtml(convertToRaw(editorState.getCurrentContent()))
		// })
	}

	const updateDescription = () => {
		setCourseState({
			...courseState,
			courseDescription: draftToHtml(convertToRaw(editorState.getCurrentContent()))
		});
		setSaveCourse(true);
	}
	// console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	console.log(courseState);
	console.log(course);
	return (
		<>
			<div className="adminCtn">
				<div className="container-fluid">
					<div className="row">
						<div className="col-10">
							<div>
								<h1>Update the Course</h1>
								<label>Name</label><input required type="text" name="courseName" onChange={updateCourse} value={courseState.loaded ? courseState.courseName : " "} size="50" /><br />
								<label>Course Intro</label><input required type="text" name="courseIntro" onChange={updateCourse} value={courseState.loaded ? courseState.courseIntro : ""} size="70" /><br />
								<label>Course Tag</label><input required type="text" name="courseTag" onChange={updateCourse} value={courseState.loaded ? courseState.courseTag : ""} size="50" /><br />

								<label>Course Description</label><br />
								{/* <textarea required type="text" name="courseDescription" onChange={updateCourse} rows="15" cols="80" value={courseState.loaded ? courseState.courseDescription : ""} /><br/> */}

								<Editor
									editorState={editorState}
									toolbarClassName="toolbarClassName"
									wrapperClassName="wrapperClassName"
									editorClassName="editorClassName"
									onEditorStateChange={onEditorStateChange}
								/>

								<label>Course Price</label><input required type="number" name="coursePrice" onChange={updateCourse} value={courseState.loaded ? courseState.coursePrice : ""} /><br />
								<div className="card">
									<div className="card-header">Course Classes</div>
								</div>
								{allClasses}
								
								<button onClick={addClass}>Add Class</button>
								<button onClick={updateDescription}>Update Course</button>
								{course && course.message ?
									<h1>{course.message}</h1> : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = state => ({
	course: state.courses,
	auth: state.auth
});


export default connect(mapStateToProps, { updateCourseAction, deleteVideoClassAction })(CourseUpdate);