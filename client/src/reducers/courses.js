import {
  GET_ONE_COURSE,
  GET_LESSONS_WATCHED,
  GET_LESSONS_WATCHED_REQUEST,
  GET_LESSONS_WATCHED_FAIL,
  GET_COURSES,
  UPDATE_COURSE,
  FINISH_LESSON,
  FINISH_LESSON_ERROR
} from '../actions/types';
import {
  COURSE_LIST_REQUEST,
  SAVE_FEATURED_COURSES_REQUEST,
  SAVE_FEATURED_COURSES_SUCCESS,
  SAVE_FEATURED_COURSES_FAIL,
  DELETE_COURSE_VIDEOCLASS_SUCCESS,
  DELETE_COURSE_VIDEOCLASS_FAIL,
  DELETE_COURSE_VIDEOCLASS_REQUEST,
  CLASS_WATCHED_UPDATED_REQUEST,
  CLASS_WATCHED_UPDATED_RESET
} from '../contants/courseConstants';

const initialState = {
  loading: true,
  data: null,
  all: [],
  message: "",
  classesWatched: null,
  classWatchedUpdated: false,
  courseProgress: 0,
  coursesLoaded: false
}

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CLASS_WATCHED_UPDATED_REQUEST:
      return {
        ...state,
        classWatchedUpdated: true
      }
    case CLASS_WATCHED_UPDATED_RESET:
      return {
        ...state,
        classWatchedUpdated: false
      }
    case COURSE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        all: []
      }
    case GET_LESSONS_WATCHED_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_ONE_COURSE:
      // console.log("inside reducer get one course");
      return {
        ...state,
        loading: false,
        data: payload.course,
        courseProgress: payload.courseProgress
      }
    case GET_COURSES:
      // console.log("Reducer ALL courses");
      // console.log(payload);
      return {
        ...state,
        loading: false,
        all: payload.courses,
        coursesLoaded: true
      }
    case UPDATE_COURSE:
      console.log(payload);
      return {
        ...state,
        message: payload.message
      }
    case FINISH_LESSON:
      // console.log(payload);
      // const updatedClasses = state.data.classes;
      // updatedClasses[payload.lesson].watched[0] = payload.watched;

      return {
        ...state,
        classesWatched: [
          ...payload.userClasses
        ],
        courseProgress: payload.progress
      }
    case FINISH_LESSON_ERROR:
      return {
        ...state,
        classesWatched: [],
        courseProgress: 0
      }
    case GET_LESSONS_WATCHED:
      return {
        ...state,
        loading: false,
        classesWatched: [
          ...payload.userClasses
        ]
      }
    case GET_LESSONS_WATCHED_FAIL:
      return {
        ...state,
        loading: false,
        classesWatched: []
      }
    case SAVE_FEATURED_COURSES_REQUEST:
    case DELETE_COURSE_VIDEOCLASS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case SAVE_FEATURED_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        all: payload
      }
    case SAVE_FEATURED_COURSES_FAIL:
    case DELETE_COURSE_VIDEOCLASS_FAIL:
      return {
        ...state,
        message: payload
      }
    case DELETE_COURSE_VIDEOCLASS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload
      }
    default:
      return state;
  }
}