import axios from 'axios';
import { API } from '../config.js';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types';

//Register User
export const register = ({ name, email, password, passwordConfirm }) => async dispatch => {
	const config = {
		headers: {
				'Content-Type': 'application/json'
		}
  }

  const body = JSON.stringify({ name, email, password, passwordConfirm });

  try {
        const res = await axios.post(`${API}/users/register`, body, config);
        //console.log(res.data);
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data
        });

        // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    // if(errors) {
    //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    dispatch({
        type: REGISTER_FAIL
    });
  }
}