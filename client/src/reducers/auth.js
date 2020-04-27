import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  LOGOUT,
  LOGOUT_FAIL
} from '../actions/types';

const initialState = {
	// token: localStorage.getItem('token'),
	token: '',
  isAuthenticated: null,
  loading: true,
  user: null
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

  switch(type) {
      case USER_LOADED:
          return {
              ...state,
              isAuthenticated: true,
              loading: false,
              user: payload.user,
              token: payload.token
          }
      case REGISTER_SUCCESS:
    //   case LOGIN_SUCCESS:
        console.log("Register Success");
				return {
						...state,
						isAuthenticated: true,
            loading: false,
            token: payload.token,
            message: payload.message,
            user: payload.user
        }
      case LOGIN_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
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
            loading: false,
            user: null
        }
      default:
          return state;
  }
}