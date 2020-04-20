import axios from 'axios';
import { API } from '../config.js';
import {
    GET_ONE_COURSE,
		GET_COURSES,
} from './types';

export const getCourses = () => async dispatch => {
  // if(localStorage.token) {
  //     setAuthToken(localStorage.token);
  // }
  
  try {
    console.log("inside actions");
      const res = await axios(`${API}/getCourses`,{
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