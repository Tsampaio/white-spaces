import axios from 'axios';
import {
  UPDATE_USER,
  UPDATE_USER_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  USER_GUEST,
  AUTH_ERROR,
  LOGOUT,
  LOGOUT_FAIL,
  EMAIL_ACTIVATION,
  ACCOUNT_ACTIVATION
} from './types';

import {
  FIND_USER_FAIL,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  USER_DETAILS_REQUEST,
  USER_LAST_LOGIN_FAIL,
  USER_LAST_LOGIN_SUCCESS,
} from '../contants/userConstants';

import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ACCOUNT_ACTIVATION_FAIL,
  RESET_NOTIFICATION,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_FAIL
} from '../contants/authConstants';

//Register User
export const register = ({ name, email, password, passwordConfirm, token }) => async dispatch => {
  
  try {
    dispatch({
      type: REGISTER_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  
    const body = JSON.stringify({ name, email, password, passwordConfirm, token });

    const res = await axios.post("/api/users/register", body, config);
    console.log("res.data");
    console.log(res.data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

  } catch (error) {
    const errors = error.response.data;
    console.log(errors.message);

    dispatch({
      type: REGISTER_FAIL,
      payload: errors
    });
  }
}

//Login User
export const login = ({ email, password, token }) => async dispatch => {
  try {
    dispatch({
      type: LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  
    const body = JSON.stringify({ email, password, token });

    const { data } = await axios.post("/api/users/login", body, config);
    console.log("res.data");
    console.log(data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data
    });

  } catch (error) {
    // const errors = err.response.data.errors;
    const errors = error.response.data;
    console.log(error.response.data.message);

    dispatch({
      type: LOGIN_FAIL,
      payload: errors
    });
  }
}

//Load User
export const getUserDetails = (id) => async dispatch => {
  try {

    dispatch({
      type: FIND_USER_REQUEST
    });

    const res = await axios.get(`/api/users/getUserDetails/${id}`);
    // console.log(res.data);

    dispatch({
      type: FIND_USER_SUCCESS,
      payload: res.data.user
    });

  } catch (err) {
    dispatch({
      type: FIND_USER_FAIL
    });

    //const errors = err.response.data.message;
    console.log(err);
  }
}

//Load User
export const loadUser = () => async dispatch => {
  try {
    const res = await axios.post('/api/users/loadUser');
    console.log(res.data);

    dispatch({
      type: USER_DETAILS_REQUEST
    });

    // console.log("Loading User");
    if (res.data.token) {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } else if (res.data.status === 'guest') {
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

//Last Login
export const lastLoginAction = () => async (dispatch, getState) => {
  try {
    console.log("Calling last login");
    const { auth } = getState();

    console.log(auth);

    if(auth && !auth.loading) {

    const today = new Date();
    const lastLogin = new Date(auth && auth.user && auth.user.lastLogin);
    
    console.log(lastLogin);

    const diffMs = (today - lastLogin); // milliseconds between now & Christmas
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");

    console.log("Difference is: " + diffMins);
    if (diffMins >= 2 ) {
      await axios.post('/api/users/lastLogin');

      dispatch({
        type: USER_LAST_LOGIN_SUCCESS,
        payload: today
      })
    }
  }

    // console.log(res.data);
  } catch (error) {
    dispatch({
      type: USER_LAST_LOGIN_FAIL,
      payload: {
        message: "Error updating last login"
      }
    })
    console.log(error);
  }
}

//Logout /Clear Profile
export const logout = () => async dispatch => {
  console.log("logout running");
  // dispatch({ type: CLEAR_PROFILE });

  try {
    await axios.get('/api/users/logout');

    //console.log(res.data);
    dispatch({
      type: LOGOUT
    });

    // dispatch(loadUser());
  } catch (err) {
    console.log(err)
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
    dispatch({
      type: FORGOT_PASSWORD_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = { email };

    const res = await axios.post('/api/users/forgotPassword', body, config);

    console.log(res.data);
    dispatch({
      type: FORGOT_PASSWORD,
      payload: res.data
    });

    // dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data;
    console.log(errors);

    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: errors
    });
  }
}

//Reset Password
export const reset_pass = ({ password, passwordConfirm, token }) => async dispatch => {
  try {
    dispatch({
      type: RESET_PASSWORD_REQUEST
    });

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ password, passwordConfirm });

    const { data } = await axios.patch(`/api/users/resetPassword/${token}`, body, config);

    console.log(data);
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data
    });

  } catch (error) {
    const errors = error.response.data;
    console.log(error.response.data.message);

    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: errors
    })

  }
}

export const activateEmail = ({ email }) => async dispatch => {
  try {
    console.log(email);
    const { data } = await axios.post(`/api/users/activateAccount/${email}`);
    console.log(data);
    dispatch({
      type: EMAIL_ACTIVATION,
      payload: data
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
    console.log("-------------------MY DATA");
    console.log(res.data);
    dispatch({
      type: ACCOUNT_ACTIVATION,
      payload: res.data
    });

  } catch (error) {
    const errors = error.response.data;
    console.log("///////// Errors");
    console.log(errors);
    dispatch({
      type: ACCOUNT_ACTIVATION_FAIL,
      payload: errors
    })
  }
}

export const resetNotification = () => async dispatch => {
  console.log("inside reset message action");
  try {
    dispatch({
      type: RESET_NOTIFICATION
    });

  } catch (error) {
    console.log(error);
  }
}

export const updateUserAction = (token, userDetails) => async dispatch => {
  try {
    console.log(userDetails);
    const body = JSON.stringify({
      name: userDetails.name,
      newPassword: userDetails.newPassword,
      newPasswordConfirm: userDetails.newPasswordConfirm,
      password: userDetails.password
    });

    const res = await axios.post(`/api/users/updateUserDb`, body, {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    console.log(res);

    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });

  } catch (error) {
    console.log(error);
    const errors = error.response.data
    dispatch({
      type: UPDATE_USER_ERROR,
      payload: errors
    });
  }
}