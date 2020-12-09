import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { createCourseAction } from '../../actions/courses';
import './Admin.css'
import ImageUpload from '../utils/imageUpload';


const CourseCreate = () => {

	const dispatch = useDispatch();

	const auth = useSelector(state => state.auth);
	const course = useSelector(state => state.courses);

	const [courseState, setCourseState] = useState({
		courseName: "",
		courseIntro: "",
		courseTag: "",
		courseDescription: [],
		coursePrice: "",
		classes: [{
			lecture: "",
			title: "",
			url: "",
			duration: 0
		}],
	});
	const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

		const index = e.target.parentElement.firstChild.value;
		console.log("current index is " + index);
		const stateRef = { ...courseState };

		stateRef.classes[index][e.target.name] = e.target.value;
		setCourseState(stateRef);
	}

	const allClasses = courseState.classes.map((theClass, i) => {

		return (
			<div key={i}>
				<input type="hidden" value={i} />
				<input type="text" name="lecture" placeholder="lecture" onChange={updateClass} />
				<input type="text" name="title" placeholder="title" onChange={updateClass} />
				<input type="text" name="url" placeholder="url" onChange={updateClass} />
				<input type="text" name="duration" placeholder="duration" onChange={updateClass} />
			</div>
		)
	});


	const saveBlogDetails = () => {
		setEditorState(editorState);
	}

	const createCourse = () => {
		// editor.save().then((outputData) => {
		// 	console.log(outputData);
		// 	setCourseState({
		// 		...courseState,
		// 		courseDescription: outputData
		// 	})
		// })
	}

	useEffect(() => {
		if (courseState.courseDescription.length > 0) {
			dispatch(createCourseAction(courseState));
		}
	}, [courseState.courseDescription]);

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState);
	}
	console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
	return (
		<>
			<div className="adminCtn">
				<div className="container-fluid">
					<div className="row">

						<div className="col-10">
							<div>
								<h1>Create your Course</h1>
								<ImageUpload courseTag={courseState.courseTag} />
								<label>Name</label><input required type="text" name="courseName" onChange={updateCourse} /><br />
								<label>Course Intro</label><input required type="text" name="courseIntro" onChange={updateCourse} /><br />
								<label>Course Tag</label><input required type="text" name="courseTag" onChange={updateCourse} /><br />

								<label>Course Description</label><br />
								{/* <textarea id="editorjs" required type="text" name="courseDescription" onChange={updateCourse} rows="15" cols="80" /><br /> */}
								<Editor
									editorState={editorState}
									toolbarClassName="toolbarClassName"
									wrapperClassName="wrapperClassName"
									editorClassName="editorClassName"
									onEditorStateChange={onEditorStateChange}
								/>

								<label>Course Price</label><input required type="text" name="coursePrice" onChange={updateCourse} /><br />
								<label>Course Classes</label>
								{allClasses}
								<button onClick={addClass}>Add Class</button>
								<button onClick={createCourse}>Create Course</button>
								<button onClick={saveBlogDetails}>Blog</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

// const mapStateToProps = state => ({
// 	course: state.courses,
// 	auth: state.auth
// });


export default CourseCreate;