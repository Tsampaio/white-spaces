import { 
  USERS_LIST_REQUEST, 
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL
} from '../contants/adminConstants';
import axios from 'axios';

export const allUsersAction = ( token ) => async dispatch => {
  try {
    console.log("INSIDE GET ALL USERS ACTION");
    console.log("The token is")
    console.log(token);
    dispatch({
      type: USERS_LIST_REQUEST
    });

    console.log("Before axios")
    const {data} = await axios.get(`/api/admin/getUsers`);

    console.log("All users");
    console.log(data);

    dispatch({
      type: USERS_LIST_SUCCESS,
      payload: data.users
    });

  } catch (error) {
    const errors = error.response.data;
    console.log(errors);
    dispatch({
      type: USERS_LIST_FAIL,
      payload: errors.message
    })
  }
}