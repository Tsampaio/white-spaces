import {
  PAY_MEMBERSHIP,
  PAY_COURSE
} from '../actions/types';

const initialState = {
  paymentToken: ''
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

  switch(type) {
    case PAY_MEMBERSHIP:
      return {
          ...state,
          paymentToken: payload.clientToken
      }
    case PAY_COURSE:
      return {
          ...state,
          result: payload
      }
    default:
      return state;

    }
}