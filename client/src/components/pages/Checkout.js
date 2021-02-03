import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import './Checkout.css';
import SecondHeader from '../partials/SecondHeader';
import {
  payAction,
  processPayment,
  findCouponIdAction,
} from '../../actions/payments';
import { removeCheckout, loadCheckout } from '../../actions/courses';
import { GET_COUPON_BY_ID_RESET } from '../../contants/couponConstants';

const Membership = ({ history }) => {
  const dispatch = useDispatch();

  const payment = useSelector((state) => state.payment);
  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const {
    coupon,
    checkoutPrice,
    checkout,
    message,
    buttonLoading,
    result,
  } = payment;

  const [data, setData] = useState({
    instance: {},
  });

  const [paymentState, setPaymentState] = useState({
    code: '',
    checkoutBackup: [],
    checkoutSale: [],
    coursesInCheckout: [],
    finalPrice: 0,
  });

  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      dispatch(payAction(user._id));
      dispatch(loadCheckout(user._id));
    }
  }, [user]);

  useEffect(() => {
    const coursesInCheckout = [];
    for (let i = 0; i < checkout.length; i++) {
      coursesInCheckout.push(checkout[i]._id);
    }

    setPaymentState({
      ...paymentState,
      checkoutBackup: [...checkout],
      coursesInCheckout: coursesInCheckout,
      finalPrice: checkoutPrice,
    });

    console.log('CHECKOUT PRICE IS SET');
  }, [checkoutPrice, checkout]);

  useEffect(() => {
    const coursesInCheckout = [];
    if (couponIsValid() && coupon && coupon.active) {
      const checkoutCopy = [...paymentState.checkoutBackup];

      const newArray = [];

      const coursesDiscounted = [];
      for (let i = 0; i < checkoutCopy.length; i++) {
        newArray.push(checkoutCopy[i].price);
        coursesInCheckout.push(checkoutCopy[i]._id);
        for (let j = 0; j < coupon.courses.length; j++) {
          if (
            coupon.courses[j].name === 'All Courses' ||
            JSON.stringify(checkoutCopy[i]._id) ===
              JSON.stringify(coupon.courses[j].courseId)
          ) {
            newArray[i] =
              coupon.amountType === 'percentage'
                ? newArray[i] - (newArray[i] * parseInt(coupon.amount)) / 100
                : newArray[i] - parseInt(coupon.amount);
            // course.price = 10
            coursesDiscounted.push(coupon.courses[j].courseId);
          }
        }
      }

      console.log(checkoutCopy);
      console.log(checkout);

      const finalPriceWithDiscount = newArray.reduce((total, price) => {
        console.log('Total price is: ' + total);
        console.log('Course price is: ' + price);
        return parseFloat(total) + parseFloat(price);
      }, 0);
      console.log('finalPriceWithDiscount+++++++++');
      console.log(finalPriceWithDiscount);

      setPaymentState({
        ...paymentState,
        checkoutSale: coursesDiscounted.length > 0 ? [...newArray] : [],
        coursesInCheckout: [...coursesInCheckout],
        finalPrice: finalPriceWithDiscount,
      });
    } else {
      setPaymentState({
        ...paymentState,
        checkoutSale: [],
        // coursesInCheckout: [...coursesInCheckout],
        finalPrice: checkoutPrice,
      });
    }
  }, [coupon]);

  const couponIsValid = () => {
    if (coupon && coupon.active) {
      const today = new Date();
      const couponDate = new Date(coupon.date);
      const dateInPast = function (future, present) {
        if (future.setHours(0, 0, 0, 0) <= present.setHours(0, 0, 0, 0)) {
          return true;
        }
        return false;
      };
      console.log('Date in past');
      console.log(dateInPast(couponDate, today));

      return (
        coupon.active && coupon.available > 0 && !dateInPast(couponDate, today)
      );
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (result) {
      history.push('/cart/checkout/success');
    }
  }, [result]);

  const buy = () => {
    console.log(data.instance);
    console.log(Object.keys(data.instance).length !== 0);
    console.log(data.instance.constructor === Object);
    console.log(disableButton);

    let nonce;
    let getNonce =
      Object.keys(data.instance).length !== 0 &&
      data.instance
        .requestPaymentMethod()
        .then(async (data) => {
          console.log(data);
          nonce = data.nonce;

          // console.log('send nonce and total to process ', nonce);
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: checkoutPrice,
          };

          // processPayment(userId, token, paymentData)
          // processPayment('131asdasd', 'adasdadad', paymentData)

          await dispatch(
            processPayment(
              paymentData,
              paymentState.code,
              paymentState.coursesInCheckout
            )
          );

          console.log('before redirect');
          // console.log( payment.result );
          // console.log( payment.result.success );

          setDisableButton(true);
        })
        .catch((error) => {
          console.log('dropin error: ', error);
        });
  };

  const showDropIn = () =>
    payment.paymentToken && (
      <Fragment>
        <DropIn
          options={{
            authorization: payment.paymentToken,
            paypal: {
              flow: 'vault',
            },
          }}
          onInstance={(instance) => (data.instance = instance)}
        />
        <button
          onClick={buy}
          className={
            disableButton ? 'btn btn-primary invisible' : 'btn btn-primary'
          }
        >
          {buttonLoading ? (
            <>
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              Loading...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </Fragment>
    );

  const checkoutItems = paymentState.checkoutBackup.map((course, i) => {
    let price =
      paymentState.checkoutSale.length > 0 && paymentState.checkoutSale[i];
    let sale = false;
    if (
      paymentState.checkoutSale.length > 0 &&
      paymentState.checkoutBackup[i].price != paymentState.checkoutSale[i]
    ) {
      sale = true;
    }

    return (
      <div className="courseInCheckout" key={i}>
        <div>
          <span
            className="courseDelete"
            onClick={() => refreshCheckout(course._id)}
          >
            <i className="fas fa-trash"></i>
          </span>
          <h3 className="checkoutCourse">{course.name}</h3>
        </div>
        <span className="coursePrice">
          {' '}
          {sale ? (
            <>
              <del>${paymentState.checkoutBackup[i].price}</del>
              <span>{price}</span>
            </>
          ) : (
            <span>{paymentState.checkoutBackup[i].price}</span>
          )}
        </span>
      </div>
    );
  });

  const refreshCheckout = async (courseId) => {
    await dispatch(removeCheckout(courseId));
    loadCheckout();
  };
  console.log(auth && auth.user && !auth.user.authenticated);

  if (auth && !auth.isAuthenticated && !auth.loading) {
    console.log('inside register redirect ');
    return <Redirect to="/register" />;
  }
  //Redirect if payment success

  // console.log(auth.user);
  // console.log( auth.token );
  // console.log(data);
  // console.log(paymentState);

  const checkCoupon = () => {
    dispatch({ type: GET_COUPON_BY_ID_RESET });
    dispatch(findCouponIdAction(paymentState.code));
  };

  // const finalPrice = () => {
  //   if(coupon && coupon.active) {
  //     setPaymentState({
  //       finalPrice:  coupon.amountType === "percentage" ? (
  //         payment.checkoutPrice - payment.checkoutPrice * coupon.amount
  //       ) :  payment.checkoutPrice - coupon.amount
  //     })
  //   }
  // }

  // console.log(checkout)
  // console.log(paymentState)
  // console.log(data.instance);
  console.log(typeof checkoutItems);
  console.log(paymentState);
  // if (payment && payment.result) {
  //   console.log("inside of redirect to success");
  //   return <Redirect to="/cart/checkout/success" />
  // }

  return (
    <Fragment>
      <SecondHeader />
      <div className="checkoutCtn">
        <div className="container">
          <div className="row">
            {payment && payment.checkout.length > 0 ? (
              <div className="col-6">
                <div className="paymentCtn">
                  <h1>Confirm your purchase</h1>
                  {showDropIn()}
                </div>
              </div>
            ) : null}
            <div
              className={
                payment && payment.checkout.length > 0
                  ? 'col-6 paper-gray'
                  : 'col-8 offset-md-2 paper-gray '
              }
            >
              <h1 className="basketTitle">Products in Basket:</h1>
              {checkoutItems && checkoutItems.length > 0 ? (
                checkoutItems
              ) : (
                <Fragment>
                  <h1>Your basket is empty</h1>{' '}
                  <Link to="/courses">Continue shopping</Link>
                </Fragment>
              )}

              {checkoutItems && checkoutItems.length > 0 ? (
                <>
                  {couponIsValid() && paymentState.checkoutSale.length > 0 ? (
                    <h5 className="my-4">
                      Coupon {coupon.code} - {coupon.name} applied
                    </h5>
                  ) : message || coupon.name ? (
                    <h5 className="my-4">Coupon is not valid</h5>
                  ) : null}

                  {/* {message && <h5 className="my-4">Coupon is not valid</h5>} */}
                  <div className="checkoutPrice">
                    Total:{' '}
                    {couponIsValid() && paymentState.checkoutSale.length > 0 ? (
                      <del>${checkoutPrice}</del>
                    ) : null}{' '}
                    ${paymentState.finalPrice}
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Enter coupon code"
                    onChange={(e) =>
                      setPaymentState({ ...paymentState, code: e.target.value })
                    }
                  />
                  <button onClick={checkCoupon}>Use coupon</button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Membership;
