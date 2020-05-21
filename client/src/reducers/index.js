import { combineReducers } from 'redux';
import auth from './auth';
import courses from './courses';
import payment from './payment';

export default combineReducers({
    auth,
    courses,
    payment
});