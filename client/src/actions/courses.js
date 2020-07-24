import axios from 'axios';
import {
  GET_ONE_COURSE,
  GET_COURSES,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT
} from './types';

export const getCourses = () => async dispatch => {
  // if(localStorage.token) {
  //     setAuthToken(localStorage.token);
  // }

  try {
    console.log("inside actions");
    const res = await axios(`/api/getCourses`, {
      method: "POST",
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

export const addCheckout = ({ selectedCourse, userEmail }) => async dispatch => {
  try {
    console.log("This is the course");
    console.log( userEmail );
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
      payload: selectedCourse
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
      payload: courseId
    });
  } catch (error) {
    
  }
}