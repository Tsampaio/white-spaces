import {
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USERS_LIST_FAIL,
  ADMIN_UPDATE_USERS_REQUEST,
  ADMIN_UPDATE_USERS_SUCCESS,
  ADMIN_UPDATE_USERS_FAIL,
  ADMIN_DELETE_USERS_REQUEST,
  ADMIN_DELETE_USERS_SUCCESS,
  ADMIN_DELETE_USERS_FAIL,
  ADMIN_ENROL_USER_IN_COURSE_REQUEST,
  ADMIN_ENROL_USER_IN_COURSE_SUCCESS,
  ADMIN_ENROL_USER_IN_COURSE_FAIL,
  ADMIN_REMOVE_USER_COURSE_REQUEST,
  ADMIN_REMOVE_USER_COURSE_SUCCESS,
  ADMIN_REMOVE_USER_COURSE_FAIL,
  ADMIN_GET_SALES_REQUEST,
  ADMIN_GET_SALES_SUCCESS,
  ADMIN_GET_SALES_FAIL,
  ADMIN_CREATE_COUPON_REQUEST,
  ADMIN_CREATE_COUPON_SUCCESS,
  ADMIN_CREATE_COUPON_FAIL,
  ADMIN_GET_COUPON_REQUEST,
  ADMIN_GET_COUPON_SUCCESS,
  ADMIN_GET_COUPON_FAIL,
  ADMIN_GET_COUPONS_REQUEST,
  ADMIN_GET_COUPONS_SUCCESS,
  ADMIN_GET_COUPONS_FAIL,
  ADMIN_UPDATE_COUPON_REQUEST,
  ADMIN_UPDATE_COUPON_SUCCESS,
  ADMIN_UPDATE_COUPON_FAIL,
  ADMIN_MEMBERSHIPS_REQUEST,
  ADMIN_MEMBERSHIPS_SUCCESS,
  ADMIN_MEMBERSHIPS_FAIL
} from '../contants/adminConstants';
import axios from 'axios';
import { FIND_USER_PURCHASES_FAIL, FIND_USER_PURCHASES_REQUEST, FIND_USER_PURCHASES_SUCCESS } from '../contants/userConstants';

export const allUsersAction = () => async dispatch => {
  try {
    console.log("INSIDE GET ALL USERS ACTION");
    
    dispatch({
      type: USERS_LIST_REQUEST
    });

    console.log("Before axios")
    const { data } = await axios.get(`/api/admin/getUsers`);

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

export const saveUsersAction = (modelText) => async dispatch => {
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

    const { data } = await axios.post(`/api/admin/updateUsers`, body, config);

    console.log(data);

    dispatch({
      type: ADMIN_UPDATE_USERS_SUCCESS,
      payload: data.users
    })

  } catch (error) {
    const errors = error.response.data;
    console.log(errors);
    dispatch({
      type: ADMIN_UPDATE_USERS_FAIL,
      payload: errors.message
    })
  }
}

export const deleteUsersAction = (modelText) => async dispatch => {
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

    const { data } = await axios.post(`/api/admin/deleteUsers`, body, config);

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

export const enrollUserInCourse = (courseId, userId) => async dispatch => {
  // console.log("Course id is: " + courseId);
  // console.log("User id is: " + userId);
  try {
    dispatch({
      type: ADMIN_ENROL_USER_IN_COURSE_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = {
      courseId,
      userId
    };

    const res = await axios.post(`/api/admin/enrolUserInCourse`, body, config);
    console.log(res.data);

    dispatch({
      type: ADMIN_ENROL_USER_IN_COURSE_SUCCESS,
      payload: res.data.courses,
      message: res.data.message
    });

  } catch (error) {

    const errors = error.response.data;
    console.log("SAVING FAIL");
    console.log(errors);
    dispatch({
      type: ADMIN_ENROL_USER_IN_COURSE_FAIL,
      payload: errors.message
    })
  }
}

export const removeCourseAction = (courseId, userId) => async dispatch => {
  // console.log("Course id is: " + courseId);
  // console.log("User id is: " + userId);
  try {
    dispatch({
      type: ADMIN_REMOVE_USER_COURSE_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = {
      courseId,
      userId
    };

    const res = await axios.post(`/api/admin/removeUserCourse`, body, config);
    console.log(res.data);

    dispatch({
      type: ADMIN_REMOVE_USER_COURSE_SUCCESS,
      payload: res.data.courses,
      message: res.data.message
    });

  } catch (error) {

    const errors = error.response.data;
    console.log("SAVING FAIL");
    console.log(errors);
    dispatch({
      type: ADMIN_REMOVE_USER_COURSE_FAIL,
      payload: errors.message
    })
  }
}

export const getSalesAction = () => async dispatch => {
  try {
    dispatch({
      type: ADMIN_GET_SALES_REQUEST
    });

    const {data} = await axios.get(`/api/admin/getSales`);

    console.log(data.sales);

    dispatch({
      type: ADMIN_GET_SALES_SUCCESS,
      payload: data.sales,
    });

  } catch (error) {
    const errors = error.response.data;
    console.log("SAVING FAIL");
    console.log(errors);
    dispatch({
      type: ADMIN_GET_SALES_FAIL,
      payload: errors.message
    })
  }
}

export const createCouponAction = (courses, couponDetails) => async dispatch => {
  try {
    dispatch({
      type: ADMIN_CREATE_COUPON_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = {
      courses,
      couponDetails
    };

    const res = await axios.post(`/api/admin/createCoupon`, body, config);
    console.log(res.data);

    dispatch({
      type: ADMIN_CREATE_COUPON_SUCCESS,
      message: res.data.message
    });
  } catch (error) {
    const errors = error.response.data;
    console.log("CREATING COUPON FAIL");
    console.log(errors);
    dispatch({
      type: ADMIN_CREATE_COUPON_FAIL,
      payload: errors.message
    })
  }
}

export const getCouponsAction = () => async dispatch => {
  try {
    dispatch({
      type: ADMIN_GET_COUPONS_REQUEST
    });
    const {data} = await axios.get("/api/admin/getCoupons");
    // console.log(res.data);
    dispatch({
      type: ADMIN_GET_COUPONS_SUCCESS,
      payload: data.coupons
    });
  } catch (error) {
    const errors = error.response.data;
    console.log("CREATING COUPON FAIL");
    console.log(errors.message);
    dispatch({
      type: ADMIN_GET_COUPONS_FAIL,
      payload: errors.message
    })
  }
}

export const getCouponIdAction = (couponId) => async dispatch => {
  console.log("Trying get course");
  try {
    dispatch({
      type: ADMIN_GET_COUPON_REQUEST
    });
    const { data } = await axios.get(`/api/admin/getCoupon/${couponId}`);
    console.log(data);
    dispatch({
      type: ADMIN_GET_COUPON_SUCCESS,
      payload: data.coupon
    });
  } catch(error) {
    const errors = error.response.data;
    console.log("GET COUPON FAIL");
    console.log(errors.message);
    dispatch({
      type: ADMIN_GET_COUPON_FAIL,
      payload: errors.message
    })
  }
}

export const updateCouponAction = (courses, couponDetails, couponId) => async dispatch => {
  try {
    dispatch({
      type: ADMIN_UPDATE_COUPON_REQUEST
    });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = {
      courses,
      couponDetails
    };
    
    console.log(body)
    console.log(couponId);

    const {data} = await axios.put(`/api/admin/updateCoupon/${couponId}`, body, config);
    console.log(data);

    dispatch({
      type: ADMIN_UPDATE_COUPON_SUCCESS,
      message: data.message
    });
  } catch (error) {
    const errors = error.response.data;
    console.log("UPDATE COUPON FAIL");
    console.log(errors.message);
    dispatch({
      type: ADMIN_UPDATE_COUPON_FAIL,
      payload: errors.message
    })
  }
}

export const getMemberships = (id) => async dispatch => {
  try {
    dispatch({
      type: ADMIN_MEMBERSHIPS_REQUEST
    });

    const { data } = await axios.get('/api/admin/getMemberships')
    console.log(data.memberships);
    dispatch({
      type: ADMIN_MEMBERSHIPS_SUCCESS,
      payload: data.memberships
    });
  } catch (error) {
    dispatch({
      type: ADMIN_MEMBERSHIPS_FAIL
    });
  }
}

