import {
  PAY_MEMBERSHIP,
  PAY_COURSE,
  PAY_ERROR,
  GET_PAYMENT_TOKEN,
  ADD_CHECKOUT,
  REMOVE_CHECKOUT,
  LOAD_CHECKOUT
} from '../actions/types';

const initialState = {
  paymentToken: '',
  result: "",
  checkout: [],
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
          result: payload.status
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
        checkout: payload
      }
    default:
      return state;
    }
}