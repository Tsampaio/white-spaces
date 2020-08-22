import {
  PAY_MEMBERSHIP,
  PAY_COURSE,
  PAY_ERROR,
  GET_PAYMENT_TOKEN,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT,
  LOAD_CHECKOUT,
  RESET_PAYMENT_RESULT
} from '../actions/types';

const initialState = {
  paymentToken: '',
  result: "",
  checkout: [],
  checkoutPrice: 0,
  addingToCheckout: false,
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

  switch(type) {
    case PAY_MEMBERSHIP:
      return {
          ...state,
          paymentToken: payload.clientToken
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
          result: payload.status,
          checkout: []
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
        checkoutPrice: payload.checkoutPrice
      }
    case RESET_PAYMENT_RESULT:
      return {
        ...state,
        result: '',
        checkout: []
      }
    default:
      return state;
    }
}