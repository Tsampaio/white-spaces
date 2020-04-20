import {
  GET_ONE_COURSE,
  GET_COURSES,
} from '../actions/types';

const initialState = {
  courses: []
}

export default function( state = initialState, action ) {
  const { type, payload } = action;

  switch(type) {
    case GET_ONE_COURSE:
      return {
          ...state,
          data: payload.course
      }
    case GET_COURSES:
      console.log("Reducer ALL courses");
      return {
          ...state,
          all: payload.courses
      }
    default:
      return state;
  }
}