import {
  GET_ONE_COURSE,
  GET_COURSES,
} from '../actions/types';

const initialState = {
  data: null,
  all: []
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

  switch(type) {
    case GET_ONE_COURSE:
      console.log("inside reducer get one course");
      return {
          ...state,
          data: payload.course
      }
    case GET_COURSES:
      console.log("Reducer ALL courses");
      console.log( payload );
      return {
          ...state,
          all: payload.courses
      }
    default:
      return state;
  }
}