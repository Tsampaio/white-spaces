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
  EMAIL_ACTIVATION,
  ACCOUNT_ACTIVATION,
  GET_COURSES_OWNED,
  COURSE_ACCESS,
  AUTH_ERROR
} from '../actions/types';
import { USER_DETAILS_REQUEST, USER_LAST_LOGIN_FAIL, USER_LAST_LOGIN_SUCCESS } from '../contants/userConstants';
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
import {
  CHECK_MEMBERSHIP,
  CHECK_MEMBERSHIP_REQUEST,
  CANCEL_MEMBERSHIP,
  RESUBSCRIBE_MEMBERSHIP,
  CANCEL_MEMBERSHIP_REQUEST
} from '../contants/membershipConstants';

const initialState = {
  // token: localStorage.getItem('token'),
  token: null,
  isAuthenticated: null,
  active: null,
  user: null,
  loading: false,
  notification: {},
  coursesOwned: [],
  coursesProgress: [],
  coursesOwnedLoaded: false,
  membership: {
    active: false
  },
  membershipLoaded: false,
  buttonLoading: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  // console.log("inside auth reducers");
  // console.log( type );
  if (payload) {

    // console.log("-------------CHANGING MESSAGE----------")
    // console.log(type)
    // console.log( payload.message );
  }
  switch (type) {
    case USER_DETAILS_REQUEST:
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
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
    case REGISTER_FAIL:
    case REGISTER_SUCCESS:
    case FORGOT_PASSWORD:
    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_SUCCESS:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        notification: payload,
        loading: false
      }
    case RESET_NOTIFICATION: {
      return {
      ...state,
      notification: {}
      }
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
        notification: payload,
        loading: false
      }
    // case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGOUT_FAIL:
    case LOGOUT:
      return {
        ...initialState
      }
    case UPDATE_USER_ERROR:
      return {
        ...state,
        notification: payload
      }
    case USER_LAST_LOGIN_FAIL:
      return {
        ...state,
        message: payload
      }
    case EMAIL_ACTIVATION:
    case ACCOUNT_ACTIVATION:
    case ACCOUNT_ACTIVATION_FAIL:
      return {
        ...state,
        active: "active",
        message: payload.message
      }
    case GET_COURSES_OWNED:
      return {
        ...state,
        coursesOwned: payload.courses,
        coursesProgress: payload.coursesProgress,
        coursesOwnedLoaded: true
      }
    case COURSE_ACCESS:
      return {
        ...state,
        courseAcces: payload.courses
      }
    case CHECK_MEMBERSHIP_REQUEST:
      return {
        ...state,
        membershipLoaded: false
      }
    case CHECK_MEMBERSHIP:
      return {
        ...state,
        membership: payload,
        membershipLoaded: true 
      }
    case CANCEL_MEMBERSHIP_REQUEST:
      return {
        ...state,
        buttonLoading: true
      }
    case CANCEL_MEMBERSHIP:
      return {
        ...state,
        buttonLoading: false,
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
        notification: payload
      }
    case USER_LAST_LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          lastLogin: payload
        }
      }
    default:
      return state;
  }
}