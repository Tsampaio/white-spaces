import { 
  USERS_LIST_REQUEST, 
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_REQUEST,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_FAIL
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

export const saveUsersAction = ( modelText ) => async dispatch => {
  console.log("Inside Save users action out")
  try {
    dispatch({
      type: ADMIN_UPDATE_USERS_REQUEST
    })

    console.log("Inside Save users action")
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = modelText;

    const {data} = await axios.post(`/api/admin/updateUsers`, body, config);

    console.log(data);

    dispatch({
      type: ADMIN_UPDATE_USERS_SUCCESS,
      payload: data.users
    })

  } catch (error) {
    const errors = error.response.data;
    console.log(errors);
    dispatch({
      type: USERS_LIST_FAIL,
      payload: errors.message
    })
  }
}