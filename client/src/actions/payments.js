import axios from 'axios';
import { GET_COUPON_BY_ID_FAIL, GET_COUPON_BY_ID_REQUEST, GET_COUPON_BY_ID_SUCCESS } from '../contants/couponConstants';
import {
  PAY_COURSE,
  PAY_ERROR,
  GET_PAYMENT_TOKEN,
  PAY_MEMBERSHIP_REQUEST,
  PAY_MEMBERSHIP,
  RESET_PAYMENT_RESULT,
  GET_USER_BILLING
} from './types';

import { PAY_COURSE_REQUEST, PAY_BUTTON_LOAD_REQUEST, PAY_BUTTON_LOAD_SUCCESS } from '../contants/paymentConstants';
import { CHECK_MEMBERSHIP, CHECK_MEMBERSHIP_REQUEST } from '../contants/membershipConstants';

export const payAction = (userId, token) => async dispatch => {
  // console.log("pay action");
  // console.log("userId", userId);
  // console.log("token", token);
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

export const processPayment = (paymentData, code, courses) => async dispatch => {
  console.log("processPayment action");
  console.log(paymentData);
  try {
    dispatch({
      type: PAY_COURSE_REQUEST
    });

    dispatch({
      type: PAY_BUTTON_LOAD_REQUEST 
    });

    console.log("inside processPayment actions");
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    // paymentData.courseTag = courseTag

    const body = {
      paymentData,
      code,
      courses
    }

    const res = await axios.post(`/api/braintree/payment`, body, config);

    console.log(res.data);

    let res2 = "";

    if (res.data.success) {
      const body2 = {
       transactionId: res.data.transactionId
      }
      res2 = await axios.post(`/api/braintree/checkout/success`, body2, config);
      console.log("email response");
      console.log(res2.data.message);

      dispatch({
        type: PAY_BUTTON_LOAD_SUCCESS
      });

      dispatch({
        type: PAY_COURSE,
        payload: res2.data
      });
    } else {
      throw new Error("Error");
    }

  } catch (err) {
    const errors = err.response.data
    dispatch({
      type: PAY_ERROR,
      payload: errors
    });
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

    dispatch({
      type: PAY_MEMBERSHIP_REQUEST,
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

export const findCouponIdAction = (couponCode) => async dispatch => {
  try {
    console.log(couponCode);

    dispatch({
      type: GET_COUPON_BY_ID_REQUEST
    });

    const {data} = await axios.get(`/api/getCouponId/${couponCode}`);
    console.log("THE COUPON IS");
    console.log(data.coupon);

    dispatch({
      type: GET_COUPON_BY_ID_SUCCESS,
      payload: data
    });

  } catch (error) {
    console.log(error);
    const errors = error.response.data;
    console.log(errors.message);

    dispatch({
      type: GET_COUPON_BY_ID_FAIL,
      payload: errors
    });
  
  }
}