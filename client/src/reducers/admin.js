import {
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_FAIL,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_REQUEST
} from '../contants/adminConstants';

const initialState = {
  loading: true,
  users: [],
  message: ""
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USERS_LIST_REQUEST:
    case ADMIN_UPDATE_USERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case USERS_LIST_SUCCESS:
    case ADMIN_UPDATE_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: payload
      }
    case USERS_LIST_FAIL:
    case ADMIN_UPDATE_USERS_FAIL:
      return {
        ...state,
        loading: false,
        message: payload
      }
    default:
      return state;
  }
}