import {
  GET_ONE_COURSE,
  GET_LESSONS_WATCHED,
  GET_COURSES,
  UPDATE_COURSE,
  FINISH_LESSON
} from '../actions/types';
import { COURSE_LIST_REQUEST } from '../contants/courseConstants';

const initialState = {
  loading: true,
  data: null,
  all: [],
  message: ""
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COURSE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        all: []
      }
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
        loading: false,
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
      updatedClasses[payload.lesson].watched[0] = payload.watched; 

      return {
        ...state,
        data: {
          ...state.data,
          classes: updatedClasses
        }
      }
    case GET_LESSONS_WATCHED:
      return {
        ...state,
        data: {
          ...state.data,
          classes: payload.course.classes
        }
      }
    default:
      return state;
  }
}