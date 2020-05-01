import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  USER_GUEST,
  LOGOUT,
  LOGOUT_FAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  EMAIL_ACTIVATION,
  ACCOUNT_ACTIVATION
} from '../actions/types';

const initialState = {
	// token: localStorage.getItem('token'),
	token: null,
  isAuthenticated: null,
  active: null,
  user: null,
  loading: true
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

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
          user: null
        }
      case REGISTER_SUCCESS:
    //   case LOGIN_SUCCESS:
        console.log("Register Success");
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
          user: payload.user
        }
      // case REGISTER_FAIL:
      // case AUTH_ERROR:
      case LOGOUT_FAIL:
      case LOGOUT:
        return {
            ...state,
            token: null,
            isAuthenticated: false,
            user: null
        }
      case FORGOT_PASSWORD:
        return {
          ...state,
          emailSent: true
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
      default:
          return state;
  }
}