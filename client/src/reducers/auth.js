import {
  UPDATE_USER,
  UPDATE_USER_ERROR,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
  USER_GUEST,
  LOGOUT,
  LOGOUT_FAIL,
  FORGOT_PASSWORD,
  EMAIL_ACTIVATION,
  ACCOUNT_ACTIVATION,
  GET_COURSES_OWNED,
  COURSE_ACCESS,
  CHECK_MEMBERSHIP,
  CANCEL_MEMBERSHIP,
  RESUBSCRIBE_MEMBERSHIP,
  AUTH_ERROR
} from '../actions/types';
import { USER_DETAILS_REQUEST } from '../contants/userConstants';
import { 
  RESET_PASSWORD, 
  RESET_PASSWORD_FAIL, 
  ACCOUNT_ACTIVATION_FAIL,
  RESET_MESSAGE 
} from '../contants/authConstants';

const initialState = {
	// token: localStorage.getItem('token'),
	token: null,
  isAuthenticated: null,
  active: null,
  user: null,
  loading: true,
  message: "",
  coursesOwned: [],
  membership: {
    active: false
  }
}

export default function( state = initialState, action ) {
  const { type, payload } = action;
  // console.log("inside auth reducers");
  // console.log( type );
  if(payload) {
  
    console.log("-------------CHANGING MESSAGE----------")
    console.log(type)
    console.log( payload.message );
  }
  switch(type) {
      case USER_DETAILS_REQUEST:
        return {
          ...state,
          loading: true
        }
      case USER_LOADED:
        return {
            ...state,
            isAuthenticated: true,
            user: payload.user,
            token: payload.token,
            active: payload.active,
            loading: false
        }
      case USER_GUEST:
        return {
          ...state,
          token: null,
          isAuthenticated: null,
          user: null,
          loading: false
        }
      case REGISTER_SUCCESS:
				return {
						...state,
            message: payload.message
        }
      case LOGIN_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          token: payload.token,
          message: payload.message,
          user: payload.user,
          active: payload.user.active,
          loading: false
        }
      case LOGIN_FAIL:
        return {
          ...state,
          message: payload.message
        }
      case RESET_MESSAGE:
        return {
          ...state,
          message: ""
        }
      // case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGOUT_FAIL:
      case LOGOUT:
        return {
            ...state,
            token: null,
            isAuthenticated: false,
            user: null,
            message: payload.message
        }
      case FORGOT_PASSWORD:
      case UPDATE_USER_ERROR:
        return {
          ...state,
          message: payload
        }
      case RESET_PASSWORD:
        return {
          ...state,
          message: payload
        }
      case RESET_PASSWORD_FAIL:
        return {
          ...state,
          message: payload
        }
      case EMAIL_ACTIVATION:
      case ACCOUNT_ACTIVATION:
      case ACCOUNT_ACTIVATION_FAIL:
        return {
          ...state,
          message: payload.message
        }
      case GET_COURSES_OWNED:
        return {
          ...state,
          coursesOwned: payload.courses
        }
      case COURSE_ACCESS:
        return {
          ...state,
          courseAcces: payload.courses
        }
      case CHECK_MEMBERSHIP:
        return {
          ...state,
          membership: payload
        }
      case CANCEL_MEMBERSHIP:
        return {
          ...state,
          membership: {
            ...state.membership,
            active: payload.active,
            status: payload.status
          }
        }
      case RESUBSCRIBE_MEMBERSHIP:
        return {
          ...state,
          membership: {
            ...state.membership,
            active: payload.active,
            status: payload.status
          }
        }
      case UPDATE_USER:
        return {
          ...state,
          message: payload.message,
          user: {
            ...state.user,
            name: payload.user.name
          }
        }
      default:
          return state;
  }
}