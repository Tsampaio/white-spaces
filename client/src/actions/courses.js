import axios from 'axios';
import {
  COURSE_ACCESS,
  GET_ONE_COURSE,
  GET_COURSES,
  GET_COURSES_OWNED,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT,
  LOAD_CHECKOUT,
  CREATE_COURSE,
  UPDATE_COURSE,
  RESET_MESSAGE
} from './types';

export const getCourses = (courses) => async dispatch => {
  // if(localStorage.token) {
  //     setAuthToken(localStorage.token);
  // }

  try {
    console.log("inside actions getCourses");

    const body = JSON.stringify({ courses });

    const res = await axios.post(`/api/getCourses`, body, {
      headers: {
        Accept: 'application/json', "Content-Type": "application/json"
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

export const getCoursesOwned = (userId) => async dispatch => {
  try {
    // console.log("inside actions getCoursesOwned");
    // console.log( userId )

    const body = JSON.stringify({ userId });

    const res = await axios.post(`/api/getCoursesOwned`, body, {
      headers: {
        Accept: 'application/json', "Content-Type": "application/json"
      }
    });

    dispatch({
      type: GET_COURSES_OWNED,
      payload: res.data
    });

  } catch (err) {
    console.log(err);
  }
}

export const getCourse = (courseTag) => async dispatch => {
  // if(localStorage.token) {
  //     setAuthToken(localStorage.token);
  // }

  try {
    console.log("inside getCourse");

    const body = JSON.stringify({ courseTag });
    console.log(body);
    const res = await axios.post(`/api/getCourse`, body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
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

export const createCourse = ({ courseName, courseIntro, courseTag, courseDescription, coursePrice, classes }) => async dispatch => {
  try {
    const body = JSON.stringify({ courseName, courseIntro, courseTag, courseDescription, coursePrice, classes });

    const res = await axios.post(`/api/createCourse`, body, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // console.log(res.data);
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

export const removeCheckout = (courseId, userId) => async dispatch => {
  try {

    const body = JSON.stringify({ courseId, userId });
    console.log(body);
    const res = await axios.post("/api/removeCheckout", body, {
      headers: {
        Accept: 'application/json',
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

export const updateCourseAction = ({ id, courseName, courseIntro, courseTag, courseDescription, coursePrice, classes }) => async dispatch => {
  try {

    const body = JSON.stringify({ id, courseName, courseIntro, courseTag, courseDescription, coursePrice, classes });
    console.log(body);
    const res = await axios.post("/api/updateCourse", body, {
      headers: {
        "Content-Type": "application/json"
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

export const loadCheckout = (userId) => async dispatch => {
  try {
    // console.log("inside loadCheckout action");
    const body = JSON.stringify({ userId });
    const res = await axios.post("/api/loadCheckout", body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json"
      }
    });

    // console.log(res);

    // console.log(res.data);
    dispatch({
      type: LOAD_CHECKOUT,
      payload: res.data
    });

    dispatch({
      type: RESET_MESSAGE
    });
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