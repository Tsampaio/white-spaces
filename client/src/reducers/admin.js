import {
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_FAIL,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_REQUEST,
  ADMIN_DELETE_USERS_REQUEST,
  ADMIN_DELETE_USERS_SUCCESS,
  ADMIN_DELETE_USERS_FAIL,
  ADMIN_ENROL_USER_IN_COURSE_REQUEST,
  ADMIN_ENROL_USER_IN_COURSE_SUCCESS,
  ADMIN_ENROL_USER_IN_COURSE_FAIL,
  ADMIN_REMOVE_USER_COURSE_REQUEST,
  ADMIN_REMOVE_USER_COURSE_FAIL,
  ADMIN_REMOVE_USER_COURSE_SUCCESS,
  ADMIN_GET_SALES_REQUEST,
  ADMIN_GET_SALES_SUCCESS,
  ADMIN_GET_SALES_FAIL,
  ADMIN_GET_COUPON_REQUEST,
  ADMIN_GET_COUPON_SUCCESS,
  ADMIN_GET_COUPON_FAIL,
  ADMIN_GET_COUPONS_REQUEST,
  ADMIN_GET_COUPONS_SUCCESS,
  ADMIN_GET_COUPONS_FAIL,
  ADMIN_MEMBERSHIPS_REQUEST,
  ADMIN_MEMBERSHIPS_FAIL,
  ADMIN_MEMBERSHIPS_SUCCESS
} from '../contants/adminConstants';
import {
  FIND_USER_PURCHASES_FAIL,
  FIND_USER_PURCHASES_REQUEST,
  FIND_USER_PURCHASES_SUCCESS,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS
} from '../contants/userConstants';
import { LOGOUT } from '../actions/types'

const initialState = {
  loading: true,
  users: [],
  message: "",
  userDetails: {},
  userPurchases: [],
  sales: [],
  coupon: {},
  coupons: [],
  memberships: []
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  // console.log(type);
  // console.log(payload);
  switch (type) {
    case USERS_LIST_REQUEST:
    case ADMIN_UPDATE_USERS_REQUEST:
    case ADMIN_DELETE_USERS_REQUEST:
    case FIND_USER_REQUEST:
    case FIND_USER_PURCHASES_REQUEST:
    case ADMIN_ENROL_USER_IN_COURSE_REQUEST:
    case ADMIN_REMOVE_USER_COURSE_REQUEST:
    case ADMIN_GET_SALES_REQUEST:
    case ADMIN_GET_COUPON_REQUEST:
    case ADMIN_GET_COUPONS_REQUEST:
    case ADMIN_MEMBERSHIPS_REQUEST:
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
    case ADMIN_ENROL_USER_IN_COURSE_FAIL:
    case ADMIN_REMOVE_USER_COURSE_FAIL:
    case ADMIN_GET_SALES_FAIL:
    case ADMIN_GET_COUPON_FAIL:
    case ADMIN_GET_COUPONS_FAIL:
    case ADMIN_MEMBERSHIPS_FAIL:
      return {
        ...state,
        loading: false,
        message: payload
      }
    case ADMIN_MEMBERSHIPS_SUCCESS:
      return {
        ...state,
        loading: false,
        memberships: payload
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
    case ADMIN_ENROL_USER_IN_COURSE_SUCCESS:
    case ADMIN_REMOVE_USER_COURSE_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          courses: payload
        }
      }
    case ADMIN_GET_SALES_SUCCESS:
      return {
        ...state,
        sales: payload
      }
    case ADMIN_GET_COUPON_SUCCESS:
      return {
        ...state,
        coupon: payload
      }
    case ADMIN_GET_COUPONS_SUCCESS:
      return {
        ...state,
        loading: false,
        coupons: payload
      }
    case LOGOUT:
      return {
        ...initialState
      }
    default:
      return state;
  }
}