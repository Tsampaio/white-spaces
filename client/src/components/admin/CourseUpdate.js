import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import store from '../../store';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../actions/courses';
import axios from 'axios';
import {
  updateCourseAction,
  deleteVideoClassAction,
} from '../../actions/courses';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { stateFromHTML } from 'draft-js-import-html';

import './Admin.css';
import './CourseUpdate.css';

const CourseUpdate = () => {
  // console.log(auth);

  const dispatch = useDispatch();

  const course = useSelector((state) => state.courses);
  const { data } = course;

  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;

  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [courseState, setCourseState] = useState({
    id: '',
    courseName: '',
    courseIntro: '',
    courseTag: '',
    courseDescription: ' ',
    coursePrice: '',
    courseLevel: 'DEFAULT',
    classes: [
      {
        id: '',
        lecture: '',
        title: '',
        url: '',
        duration: 0,
      },
    ],
    loaded: false,
  });

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [saveCourse, setSaveCourse] = useState(false);

  const { courseTag } = useParams();

  useEffect(() => {
    setCourseValues();
  }, [courseState.loaded, course.loading, auth]);

  useEffect(() => {
    if (courseState.courseDescription) {
      setEditorState(
        EditorState.createWithContent(
          stateFromHTML(courseState.courseDescription)
        )
      );
    }
  }, [courseState.courseDescription]);

  useEffect(() => {
    if (saveCourse) {
      dispatch(updateCourseAction(courseState));
    }
  }, [saveCourse]);

  const setCourseValues = async () => {
    await dispatch(getCourse(courseTag, user && user._id));

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
      loaded: true,
      courseLevel: course && course.data && course.data.courseLevel,
    });
  };

  const addClass = () => {
    setCourseState({
      ...courseState,
      classes: [
        ...courseState.classes,
        {
          lecture: '',
          title: '',
          url: '',
          duration: 0,
        },
      ],
    });
  };

  const updateCourse = (e) => {
    setCourseState({
      ...courseState,
      [e.target.name]: e.target.value,
    });
  };

  const updateClass = (e) => {
    const index = e.target.parentElement.parentElement.firstChild.value;
    console.log('current index is ' + index);
    const stateRef = { ...courseState };
    console.log(e.target.value);
    if (e.target.name === ('duration' || 'lecture')) {
      stateRef.classes[index][e.target.name] = parseInt(e.target.value);
    } else {
      stateRef.classes[index][e.target.name] = e.target.value;
    }
    setCourseState(stateRef);
  };

  const allClasses =
    courseState.classes &&
    courseState.classes.length > 0 &&
    courseState.classes.map((theClass, i) => {
      return (
        <div key={i} className="card singleClassCtn">
          <input type="hidden" value={i} />
          <div className="card-body">
            <label htmlFor="classNumber" className="col-2">
              Class Number
            </label>
            <input
              id="classNumber"
              type="number"
              name="lecture"
              placeholder="lecture"
              onChange={updateClass}
              value={
                courseState.classes[i].lecture
                  ? courseState.classes[i].lecture
                  : ''
              }
            />
          </div>
          <div className="card-body">
            <label htmlFor="classTitle" className="col-2">
              Class Title
            </label>
            <input
              id="classTitle"
              type="text"
              name="title"
              placeholder="title"
              onChange={updateClass}
              value={
                courseState.classes[i].title ? courseState.classes[i].title : ''
              }
              size="50"
            />
          </div>
          <div className="card-body">
            <label htmlFor="classVideoUrl" className="col-2">
              Class Video Url
            </label>
            <input
              id="classVideoDuration"
              type="text"
              name="url"
              placeholder="url"
              onChange={updateClass}
              value={
                courseState.classes[i].url ? courseState.classes[i].url : ''
              }
              size="50"
            />
          </div>
          <div className="card-body">
            <label htmlFor="classVideoDuration" className="col-2">
              Class Video Duration
            </label>
            <input
              id="classVideoDuration"
              type="number"
              name="duration"
              placeholder="duration"
              onChange={updateClass}
              value={
                courseState.classes[i].duration
                  ? courseState.classes[i].duration
                  : ''
              }
            />
          </div>
          <div className="card-body">
            <button
              onClick={() =>
                dispatch(
                  deleteVideoClassAction(
                    courseState.id,
                    courseState.classes[i]._id
                  )
                )
              }
            >
              <i className="fas fa-trash-alt"></i> Delete Video
            </button>
          </div>
        </div>
        // value={courseState.classes[i].lecture}
      );
    });

  // console.log(course);
  // console.log(courseState);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    // setCourseState({
    // 	...courseState,
    // 	courseDescription: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // })
  };

  const updateDescription = () => {
    setCourseState({
      ...courseState,
      courseDescription: draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      ),
    });
    setSaveCourse(true);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append('course', file);

    // for (let [key, value] of formData) {
    //   console.log(`${key}: ${value.name}`)
    // }
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axios.post(
        `/api/coursePic/${data.tag}`,
        formData,
        config
      );
      console.log(res.data);
      setImage(res.data);
      setUploading(false);
    } catch (error) {
      console.log(error.data);
      setUploading(false);
    }
  };

  const images = require.context('../../../../uploads/courses/', true);
  let img = '';
  try {
    img = images(`./${data && data.tag}.jpg`);
  } catch (error) {
    img = images(`./default-course.jpg`);
  }
  // if( data && data.tag ) {
  //   img = images(`./${data && data.tag}.jpg`);
  // } else {
  //   img = images(`./default-course.jpg`);
  // }
  let userPic = <img src={img.default} alt="my sf" className="courseCover" />;

  // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  // console.log(courseState);
  console.log(courseState);
  // console.log(data && data.tag);
  return (
    <>
      <div className="adminCtn">
        <div className="container-fluid">
          <div className="row">
            <div className="col-10">
              <div>
                <h1>Update the Course</h1>
                {userPic}
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image url"
                    value={image ? image : ''}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  <Form.File
                    id="image-file"
                    label="Choose File"
                    custom
                    onChange={uploadFileHandler}
                  ></Form.File>
                </Form.Group>
                <label>Name</label>
                <input
                  required
                  type="text"
                  name="courseName"
                  onChange={updateCourse}
                  value={courseState.loaded ? courseState.courseName : ''}
                  size="50"
                />
                <br />
                <label>Course Intro</label>
                <input
                  required
                  type="text"
                  name="courseIntro"
                  onChange={updateCourse}
                  value={courseState.loaded ? courseState.courseIntro : ''}
                  size="70"
                />
                <br />
                <label>Course Tag</label>
                <input
                  required
                  type="text"
                  name="courseTag"
                  onChange={updateCourse}
                  value={courseState.loaded ? courseState.courseTag : ''}
                  size="50"
                />
                <br />
                <label>Course Level</label>
                <select name="courseLevel" onChange={updateCourse} value={courseState.courseLevel}>
                  <option value="DEFAULT" disabled>
                    Level
                  </option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <br />

                <label>Course Description</label>
                <br />
                {/* <textarea required type="text" name="courseDescription" onChange={updateCourse} rows="15" cols="80" value={courseState.loaded ? courseState.courseDescription : ""} /><br/> */}

                <Editor
                  editorState={editorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  onEditorStateChange={onEditorStateChange}
                />

                <label>Course Price</label>
                <input
                  required
                  type="number"
                  name="coursePrice"
                  onChange={updateCourse}
                  value={courseState.loaded ? courseState.coursePrice : ''}
                />
                <br />
                <div className="card">
                  <div className="card-header">Course Classes</div>
                </div>
                {allClasses}

                <button onClick={addClass}>Add Class</button>
                <button onClick={updateDescription}>Update Course</button>
                {course && course.message ? <h1>{course.message}</h1> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseUpdate;
