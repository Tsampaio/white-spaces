import axios from 'axios';
import {
    PAY_COURSE,
    PAY_MEMBERSHIP
} from './types';

export const payAction = (userId, token) => async dispatch => {
  console.log("pay action");
  console.log("userId", userId );
  console.log("token", token );
  try {
    console.log("inside actions");
      const res = await axios(`/api/braintree/getToken/${userId}`,{
        method: "GET",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`
        }
      });
      console.log(res.data);
      dispatch({
          type: PAY_MEMBERSHIP,
          payload: res.data
      });
     
  } catch (err) {
      // const errors = err.response.data.message;
      console.log(err);
  }
}

export const processPayment = (user, token, paymentData) => async dispatch => {
  console.log("processPayment action");
  console.log(paymentData);
  try {
    console.log("inside actions");
    const config = {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    
    const body = JSON.stringify(paymentData);
    
    const res = await axios.post(`/api/braintree/payment/${user._id}`, body, config);
      
    console.log(res.data);

    if(res.data.success) {
      const body2 = {
        email: user.email
      }
      const res2 = await axios.post(`/api/braintree/checkout/success`, body2, config);
      console.log("email response");
      console.log(res2.data.message);
    }
    dispatch({
        type: PAY_COURSE,
        payload: res.data
    });
     
  } catch (err) {
      // const errors = err.response.data.message;
      console.log(err);
  }
}

export const subscriptionPayment = (userId, token, paymentData) => async dispatch => {
 
  console.log(paymentData);
  try {
    console.log("inside subscriptionPayment actions");
    const config = {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    
    const body = JSON.stringify(paymentData);

      const res = await axios.post(`/api/braintree/subscription/${userId}`,body, config);
        
      console.log(res.data);
      dispatch({
          type: PAY_MEMBERSHIP,
          payload: res.data
      });
     
  } catch (err) {
      // const errors = err.response.data.message;
      console.log(err);
  }
}