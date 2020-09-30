import axios from 'axios';
import {
  CHECK_MEMBERSHIP,
  CANCEL_MEMBERSHIP,
  RESUBSCRIBE_MEMBERSHIP
} from './types';

export const checkMembership = (token) => async dispatch => {
  
  try {
    console.log("inside checkMembership");

    const body = JSON.stringify({token});

    const res = await axios.post(`/api/checkMembership`, body, {
      headers: {
        Accept: 'application/json', 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res.data);
    dispatch({
      type: CHECK_MEMBERSHIP,
      payload: res.data
    });

  } catch (err) {
    // const errors = err.response.data.message;
    console.log(err);
  }
}

export const cancelMembership = (token) => async dispatch => {
  try {
   console.log("inside cancelMembership");

    const res = await axios.post(`/api/cancelMembership`, {}, {
      headers: {
        Accept: 'application/json', 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res.data);

   dispatch({
    type: CANCEL_MEMBERSHIP,
    payload: res.data
   })
  } catch (error) {
    console.log(error)
  }
}

export const membershipResubscribe = (token) => async dispatch => {
  try {
    console.log("inside membershipResubscribe");

    const res = await axios.post(`/api/resubscribeMembership`, {}, {
      headers: {
        Accept: 'application/json', 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res.data);

    dispatch({
      type: RESUBSCRIBE_MEMBERSHIP,
      payload: res.data
     })
  } catch (error) {
    
  }
}

