import {
  RESET_MESSAGE,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
  USER_GUEST,
  LOGOUT,
  LOGOUT_FAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  EMAIL_ACTIVATION,
  ACCOUNT_ACTIVATION,
  GET_COURSES_OWNED,
  COURSE_ACCESS,
  CHECK_MEMBERSHIP
} from '../actions/types';

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
  // console.log( payload );
  switch(type) {
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
          active: payload.user.active
        }
      case LOGIN_FAIL:
        return {
          ...state,
          message: payload.message
        }
      case RESET_MESSAGE:
        return {
          ...state,
          message: payload
        }
      // case REGISTER_FAIL:
      // case AUTH_ERROR:
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
        return {
          ...state,
          message: payload
        }
      case RESET_PASSWORD:
        return {
          ...state,
          message: 'Password Reseted'
        }
      case EMAIL_ACTIVATION:
      case ACCOUNT_ACTIVATION:
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
      default:
          return state;
  }
}