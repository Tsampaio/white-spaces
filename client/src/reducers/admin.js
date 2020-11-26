import {
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL
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
      return {
        ...state,
        loading: true
      }
    case USERS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        users: payload
      }
    case USERS_LIST_FAIL:
      return {
        ...state,
        loading: false,
        message: payload
      }
    default:
      return state;
  }
}