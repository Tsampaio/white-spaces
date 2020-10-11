import axios from 'axios';
import {
  PAY_COURSE,
  PAY_ERROR,
  GET_PAYMENT_TOKEN,
  PAY_MEMBERSHIP,
  RESET_PAYMENT_RESULT,
  GET_USER_BILLING
} from './types';

export const payAction = (userId, token) => async dispatch => {
  console.log("pay action");
  console.log("userId", userId);
  console.log("token", token);
  try {
    console.log("inside actions");
    console.log(`/api/braintree/getToken/${userId}`);
    const res = await axios(`/api/braintree/getToken/${userId}`, {
      method: "GET",
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`
      }
    });
    console.log(res.data);
    dispatch({
      type: GET_PAYMENT_TOKEN,
      payload: res.data
    });
  } catch (err) {
    // const errors = err.response.data.message;
    console.log(err);
  }
}

export const processPayment = (user, token, paymentData, courseTag) => async dispatch => {
  console.log("processPayment action");
  console.log(paymentData);
  try {
    console.log("inside processPayment actions");
    const config = {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
    paymentData.courseTag = courseTag

    const body = JSON.stringify(paymentData);

    const res = await axios.post(`/api/braintree/payment`, body, config);

    console.log(res.data);

    let res2 = "";

    if (res.data.success) {
      const body2 = {
        email: user.email,
        courseTag,
        amount: paymentData.amount
      }
      res2 = await axios.post(`/api/braintree/checkout/success`, body2, config);
      console.log("email response");
      console.log(res2.data.message);

      dispatch({
        type: PAY_COURSE,
        payload: res2.data

      });
    } else {
      dispatch({
        type: PAY_ERROR,
        payload: "Error Getting the payment Token"
      });
    }




  } catch (err) {
    // const errors = err.response.data.message;
    console.log(err);
  }
}

export const membershipPayment = (user, token, paymentData, duration) => async dispatch => {
  console.log("this is payment data");
  // console.log(paymentData);
  // console.log(duration);
  // console.log(user.membership.customerID);
  try {
    console.log("inside subscriptionPayment actions");
    const config = {
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    // const body = JSON.stringify(paymentData);
    const body = JSON.stringify({
      ...paymentData,
      name: user.name,
      email: user.email,
      membershipDuration: duration
    });

    const res = await axios.post(`/api/braintree/membership/${user._id}`, body, config);

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

export const resetPaymentResult = () => async dispatch => {
  try {
    dispatch({
      type: RESET_PAYMENT_RESULT,
    });
  } catch (error) {
    console.log(error);
  }
}

export const getBilling = () => async dispatch => {

  try {
    console.log("inside getUser billing")
    const res = await axios.post("/api/braintree/getUserBilling");

    console.log(res.data)

    dispatch({
      type: GET_USER_BILLING,
      payload: res.data
    });
  } catch (error) {
    console.log(error);
  }
};