import {
  PAY_MEMBERSHIP,
  PAY_COURSE,
  PAY_ERROR,
  GET_PAYMENT_TOKEN,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT,
  LOAD_CHECKOUT,
  RESET_PAYMENT_RESULT,
  GET_USER_BILLING
} from '../actions/types';
import { GET_COUPON_BY_ID_FAIL, GET_COUPON_BY_ID_REQUEST, GET_COUPON_BY_ID_RESET, GET_COUPON_BY_ID_SUCCESS } from '../contants/couponConstants';
import { PAY_COURSE_REQUEST, PAY_BUTTON_LOAD_SUCCESS } from '../contants/paymentConstants';

const initialState = {
  loading: false,
  paymentToken: '',
  result: "",
  checkout: [],
  checkoutPrice: 0,
  addingToCheckout: false,
  paymentComplete: false,
  billing: [],
  coupon: {},
  message: "",
  buttonLoading: false,
  checkoutLoaded: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_COUPON_BY_ID_REQUEST:
      return {
        ...state,
        loading: true
      }
    case PAY_MEMBERSHIP:
      return {
        ...state,
        paymentToken: payload.clientToken,
        paymentComplete: payload.paymentComplete
      }
    case GET_PAYMENT_TOKEN:
      return {
        ...state,
        addingToCheckout: false,
        paymentToken: payload.clientToken
      }
    case PAY_COURSE:
      return {
        ...state,
        loading: false,
        result: payload.status,
        checkout: []
      }
    case PAY_ERROR:
      return {
        ...state,
        loading: false,
        notification: payload
      }
    case ADD_CHECKOUT:
      return {
        ...state,
        addingToCheckout: true,
        checkout: payload
      }
    case REMOVE_CHECKOUT:
      return {
        ...state,
        checkout: payload
      }
    case LOAD_CHECKOUT:
      return {
        ...state,
        checkout: payload.checkout,
        checkoutPrice: payload.checkoutPrice,
        checkoutLoaded: true
      }
    case RESET_PAYMENT_RESULT:
      return {
        ...state,
        result: '',
        checkout: []
      }
    case GET_USER_BILLING:
      return {
        ...state,
        billing: payload.billing
      }
    case GET_COUPON_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        coupon: payload,
      }
    case GET_COUPON_BY_ID_FAIL:
      return {
        ...state,
        loading: false,
        message: payload,
      }
    case GET_COUPON_BY_ID_RESET:
      return {
        ...state,
        coupon: {}
      }
    case PAY_COURSE_REQUEST:
      return {
        ...state,
        loading: true
      }
    case PAY_BUTTON_LOAD_SUCCESS:
      return {
        ...state,
        buttonLoading: false
      }
    default:
      return state;
  }
}