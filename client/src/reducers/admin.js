import {
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_FAIL,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_REQUEST,
  ADMIN_DELETE_USERS_REQUEST,
  ADMIN_DELETE_USERS_SUCCESS,
  ADMIN_DELETE_USERS_FAIL
} from '../contants/adminConstants';
import { FIND_USER_PURCHASES_FAIL, FIND_USER_PURCHASES_REQUEST, FIND_USER_PURCHASES_SUCCESS, FIND_USER_REQUEST, FIND_USER_SUCCESS } from '../contants/userConstants';

const initialState = {
  loading: true,
  users: [],
  message: "",
  userDetails: {},
  userPurchases: []
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USERS_LIST_REQUEST:
    case ADMIN_UPDATE_USERS_REQUEST:
    case ADMIN_DELETE_USERS_REQUEST:
    case FIND_USER_REQUEST:
    case FIND_USER_PURCHASES_REQUEST:
      return {
        ...state,
        loading: true
      }
    case USERS_LIST_SUCCESS:
    case ADMIN_UPDATE_USERS_SUCCESS:
    case ADMIN_DELETE_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: payload
      }
    case USERS_LIST_FAIL:
    case ADMIN_UPDATE_USERS_FAIL:
    case ADMIN_DELETE_USERS_FAIL:
    case FIND_USER_PURCHASES_FAIL:
      return {
        ...state,
        loading: false,
        message: payload
      }
    case FIND_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        userDetails: payload
      }
    case FIND_USER_PURCHASES_SUCCESS:
      return {
        ...state,
        userPurchases: payload
      }
    default:
      return state;
  }
}