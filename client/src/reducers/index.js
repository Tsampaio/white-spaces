import { combineReducers } from 'redux';
import auth from './auth';
import courses from './courses';
import payment from './payment';
import admin from './admin';

export default combineReducers({
    auth,
    courses,
    payment,
    admin
});