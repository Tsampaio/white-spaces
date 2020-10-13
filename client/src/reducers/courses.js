import {
  GET_ONE_COURSE,
  GET_COURSES,
  UPDATE_COURSE,
  FINISH_LESSON
} from '../actions/types';

const initialState = {
  data: null,
  all: [],
  message: ""
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ONE_COURSE:
      console.log("inside reducer get one course");
      return {
        ...state,
        data: payload.course
      }
    case GET_COURSES:
      console.log("Reducer ALL courses");
      console.log(payload);
      return {
        ...state,
        all: payload.courses
      }
    case UPDATE_COURSE:
      console.log(payload);
      return {
        ...state,
        message: payload.message
      }
    case FINISH_LESSON:
      // console.log(payload);
      const updatedClasses = state.data.classes;
      updatedClasses[payload.lesson].watched = payload.watched; 

      return {
        ...state,
        data: {
          ...state.data,
          classes: updatedClasses
        }
      }
    default:
      return state;
  }
}