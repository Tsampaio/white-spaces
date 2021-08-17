import axios from 'axios';
import {
  COURSE_ACCESS,
  GET_ONE_COURSE,
  GET_LESSONS_WATCHED,
  GET_LESSONS_WATCHED_REQUEST,
  GET_LESSONS_WATCHED_FAIL,
  GET_COURSES,
  GET_COURSES_OWNED,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT,
  LOAD_CHECKOUT,
  UPDATE_COURSE,
  FINISH_LESSON,
  FINISH_LESSON_ERROR
} from './types';
import { COURSE_LIST_REQUEST, 
  DELETE_COURSE_VIDEOCLASS_FAIL, 
  DELETE_COURSE_VIDEOCLASS_REQUEST, 
  DELETE_COURSE_VIDEOCLASS_SUCCESS, 
  SAVE_FEATURED_COURSES_FAIL, 
  SAVE_FEATURED_COURSES_REQUEST, 
  SAVE_FEATURED_COURSES_SUCCESS,
  CLASS_WATCHED_UPDATED_REQUEST,
  CLASS_WATCHED_UPDATED_RESET
} from '../contants/courseConstants';
// import { RESET_MESSAGE } from '../contants/authConstants';

export const getCourses = (courses) => async dispatch => {

  try {

    dispatch({
      type: COURSE_LIST_REQUEST
    });

    // console.log("inside actions getCourses");

    const body = JSON.stringify({ courses });

    const res = await axios.post(`/api/getCourses`, body, {
      headers: {
        Accept: 'application/json', 
        "Content-Type": "application/json"
      }
    });

    dispatch({
      type: GET_COURSES,
      payload: res.data
    });

  } catch (err) {
    // const errors = err.response.data.message;
    console.log(err);
  }
}

export const getCoursesOwned = () => async dispatch => {
  try {
    // console.log("inside actions getCoursesOwned");
    // console.log( userId )

    // const userId  = auth && auth.token;

    // const body = JSON.stringify({ userId });
    console.log("<<<<<< Trying to find CoursesOwned ACTION")
    const res = await axios.get(`/api/getCoursesOwned`);

    console.log(res.data)

    dispatch({
      type: GET_COURSES_OWNED,
      payload: res.data
    });

  } catch (err) {
    console.log(err);
  }
}

export const getCourse = (courseTag, userId) => async (dispatch, getState) => {
  // if(localStorage.token) {
  //     setAuthToken(localStorage.token);
  // }
  try {
    console.log("inside getCourse");
    const body = userId ? JSON.stringify({ courseTag, userId }) : JSON.stringify({ courseTag });
    console.log(body);
   
    const res = await axios.post(`/api/getCourse`, body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
      }
    });

    console.log(res.data);
    
    dispatch({
      type: GET_ONE_COURSE,
      payload: res.data
    });

  } catch (err) {
    // const errors = err.response.data.message;
    console.log(err);
  }
}

export const lessonsWatchedAction = (courseTag, token) => async dispatch => {
  try {
    console.log("inside lessonsWatchedAction");
    // console.log(token)

    dispatch({
      type: GET_LESSONS_WATCHED_REQUEST,
    });

    const body = JSON.stringify({ courseTag });
    console.log(body);
    const res = await axios.post(`/api/getLessonsWatched`, body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : 'No'
      }
    });

    console.log(res.data);

    dispatch({
      type: GET_LESSONS_WATCHED,
      payload: res.data
    });
  } catch (error) {
    console.log("GET LESSONS WATCHED FAIL")
    console.log(error);
    dispatch({
      type: GET_LESSONS_WATCHED_FAIL,
    });
  }
}

export const createCourseAction = (
  { courseName, 
    courseIntro, 
    courseTag, 
    courseDescription, 
    coursePrice, 
    classes
  }) => async (dispatch, getState) => {
  console.log("Inside Create COURSE ACTION");
  try {
    const { auth } = getState();

    const body = JSON.stringify(
      { courseName, 
        courseIntro, 
        courseTag, 
        courseDescription, 
        coursePrice, 
        classes
      });

    const res = await axios.post(`/api/createCourse`, body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`
      }
    });

    console.log(res.data);
    console.log(body);
    console.log("inside create course");

    // dispatch({
    //   type: CREATE_COURSE,
    //   payload: res.data
    // });
  } catch (error) {

  }
}

export const addCheckout = ({ selectedCourse, userEmail }) => async dispatch => {
  try {
    console.log("This is the course");
    console.log(userEmail);
    const body = JSON.stringify({ selectedCourse, userEmail });
    console.log(body);
    const res = await axios.post("/api/addCheckout", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
      }
    });

    console.log(res.data);
    dispatch({
      type: ADD_CHECKOUT,
      payload: res.data.checkout
    });

    console.log(selectedCourse);
  } catch (error) {
    console.log(error);
  }
}

export const removeCheckout = (courseId) => async dispatch => {
  try {

    const body = { courseId};
    console.log(body);
    const res = await axios.post("/api/removeCheckout", body, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(res.data);
    dispatch({
      type: REMOVE_CHECKOUT,
      payload: res.data.checkout
    });

  } catch (error) {

  }
}

export const updateCourseAction = ({ id, courseName, courseIntro, courseTag, courseDescription, coursePrice, classes, courseLevel }) => async (dispatch, getState) => {
  try {

    const { auth } = getState();

    const body = JSON.stringify({ id, courseName, courseIntro, courseTag, courseDescription, coursePrice, classes, courseLevel });
    console.log(body);
    const res = await axios.post("/api/admin/updateCourse", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`
      }
    });

    console.log(res.data);
    dispatch({
      type: UPDATE_COURSE,
      payload: res.data
    });

  } catch (error) {

  }
}

export const loadCheckout = () => async dispatch => {
  try {
    // console.log("inside loadCheckout action");
 
    const res = await axios.post("/api/loadCheckout");

    // console.log(res);

    // console.log(res.data);
    dispatch({
      type: LOAD_CHECKOUT,
      payload: res.data
    });

    // dispatch({
    //   type: RESET_MESSAGE
    // });
  } catch (error) {

  }
}

export const courseAccess = (courseTag, userId) => async dispatch => {

  try {
    console.log(userId);
    const body = JSON.stringify({ courseTag, userId });
    console.log("inside courseAccess");
    console.log(body);
    const res = await axios.post("/api/courseAccess", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
      }
    });

    console.log(res.data);
    dispatch({
      type: COURSE_ACCESS,
      payload: res.data
    });
  } catch (error) {

  }
}

export const finishLessonAction = (lesson, courseId, token) => async dispatch => {
  try {
    console.log("clicking lesson finished " + lesson);

    const body = JSON.stringify({ lesson, courseId });
    console.log(body);
    const res = await axios.post("/api/finishLesson", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    console.log(res.data);

    dispatch({
      type: FINISH_LESSON,
      payload: res.data
    });

    dispatch({
      type: CLASS_WATCHED_UPDATED_REQUEST
    })

  } catch (error) {
    console.log("There is an error finishing the class");
    dispatch({
      type: FINISH_LESSON_ERROR,
    });
    
  }
}

export const saveFeaturedCoursesAction = (data, token) => async dispatch => {
  try {
    console.log(data);
    console.log(token)
    dispatch({
      type: SAVE_FEATURED_COURSES_REQUEST
    });

    console.log(data);
    const res = await axios.post("/api/saveFeaturedCourses", data, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    console.log(res.data);

    dispatch({
      type: SAVE_FEATURED_COURSES_SUCCESS,
      payload: res.data.courses
    });

  } catch (error) {
    const errors = error.response.data;
    console.log("SAVING FAIL");
    console.log(errors);
    dispatch({
      type: SAVE_FEATURED_COURSES_FAIL,
      payload: errors.message
    })
  }
}

export const deleteVideoClassAction = (courseId, classId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_COURSE_VIDEOCLASS_REQUEST,
    });

    const body = { courseId, classId };
    console.log(body)
    
    const { auth: { token } } = getState();
    console.log(token);
    const res = await axios.post("/api/deleteVideoClass", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    console.log(res.data);

    dispatch({
      type: DELETE_COURSE_VIDEOCLASS_SUCCESS,
      payload: res.data.course
    });

  } catch (error) {
    const errors = error.response.data;
    console.log("SAVING FAIL");
    console.log(errors);
    dispatch({
      type: DELETE_COURSE_VIDEOCLASS_FAIL,
      payload: errors.message
    })
  }
}

export const classWatchedUpdateReset = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CLASS_WATCHED_UPDATED_RESET
    })
  } catch (error) {
    
  }
}
