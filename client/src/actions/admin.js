import { 
  USERS_LIST_REQUEST, 
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_REQUEST,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_FAIL,
  ADMIN_DELETE_USERS_REQUEST,
  ADMIN_DELETE_USERS_SUCCESS,
  ADMIN_DELETE_USERS_FAIL
} from '../contants/adminConstants';
import axios from 'axios';
import { FIND_USER_PURCHASES_FAIL, FIND_USER_PURCHASES_REQUEST, FIND_USER_PURCHASES_SUCCESS } from '../contants/userConstants';

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

export const deleteUsersAction = ( modelText ) => async dispatch => {
  console.log("Inside Delete users action out")
  console.log(modelText);
  try {
    dispatch({
      type: ADMIN_DELETE_USERS_REQUEST
    })

    console.log("Inside Delete users action")
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = modelText;

    const {data} = await axios.post(`/api/admin/deleteUsers`, body, config);

    console.log(data);

    dispatch({
      type: ADMIN_DELETE_USERS_SUCCESS,
      payload: data.users
    })

  } catch (error) {
    const errors = error.response.data;
    console.log(errors);
    dispatch({
      type: ADMIN_DELETE_USERS_FAIL,
      payload: errors.message
    })
  }
}

export const getUserPurchases = (id) => async dispatch => {
  try {

    dispatch({
      type: FIND_USER_PURCHASES_REQUEST
    });

    const res = await axios.get(`/api/users/getUserPurchases/${id}`);
    console.log(res.data);

    dispatch({
      type: FIND_USER_PURCHASES_SUCCESS,
      payload: res.data.transactions
    });

  } catch (err) {
    dispatch({
      type: FIND_USER_PURCHASES_FAIL
    });

    //const errors = err.response.data.message;
    console.log(err);
  }
}