import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    USER_LOADED,
    USER_GUEST,
    AUTH_ERROR,
    LOGOUT,
    LOGOUT_FAIL,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    EMAIL_ACTIVATION,
    ACCOUNT_ACTIVATION
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
    const res = await axios.post("/api/users/register", body, config);
    console.log("res.data");
    console.log(res.data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    
    dispatch({
        type: REGISTER_FAIL
    });
  }
}

//Login User
export const login = ({ email, password }) => async dispatch => {
	const config = {
		headers: {
				'Content-Type': 'application/json'
		}
  }

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/users/login", body, config);
    console.log("res.data");
    console.log(res.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

  } catch (error) {
    // const errors = err.response.data.errors;
    console.log(error);
    
    dispatch({
        type: REGISTER_FAIL
    });
  }
}

//Load User
export const loadUser = () => async dispatch => {
  try {
      const res = await axios.post('/api/users/loadUser');
      console.log(res.data);

      if( res.data.token ) {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
      } else if(res.data.status == 'guest') {
        dispatch({
          type: USER_GUEST
        });
      }
  } catch (err) {
      dispatch({
          type: AUTH_ERROR
      });

      //const errors = err.response.data.message;
      console.log(err);
  }
}

//Logout /Clear Profile
export const logout = () => async dispatch => {
  console.log("logout running");
  // dispatch({ type: CLEAR_PROFILE });

  try {
      const res = await axios.get('/api/users/logout');

      //console.log(res.data);
      dispatch({ type: LOGOUT });

      
      // dispatch(loadUser());
  } catch (err) {
      const errors = err.response.data.errors;
      console.log(errors);
      // if(errors) {
      //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      // }

      dispatch({
          type: LOGOUT_FAIL
      });
  }
}

//Forgot Password
export const fgt_pass = ({ email }) => async dispatch => {
  try {
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ email });

    const res = await axios.post('/api/users/forgotPassword', body, config);

    //console.log(res.data);
    dispatch({ type: FORGOT_PASSWORD });

    
    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    // if(errors) {
    //     errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }

    // dispatch({
    //     type: LOGOUT_FAIL
    // });
  }
}

//Reset Password
export const reset_pass = ({ password, passwordConfirm, token }) => async dispatch => {
  try {
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ password, passwordConfirm });

    const res = await axios.patch(`/api/users/resetPassword/${token}`, body, config);

    //console.log(res.data);
    dispatch({ type: RESET_PASSWORD });

    
    // dispatch(loadUser());
} catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
  }
}

export const activateEmail = ({email}) => async dispatch => {
  try {
    console.log(email);
    const res = await axios.post(`/api/users/activateAccount/${email}`);
    console.log(res.data);
    dispatch({ 
      type: EMAIL_ACTIVATION,
      payload: res.data
    });

  } catch (error) {
    console.log(error);
  }
}

export const activateEmailAction = (token) => async dispatch => {
  console.log("Inside ActiveEmailAction");
  try {
    console.log(token);
    const res = await axios.post(`/api/users/activate/${token}`);
    console.log(res.data);
    dispatch({ 
      type: ACCOUNT_ACTIVATION,
      payload: res.data
    });

  } catch (error) {
    console.log(error);
  }
}