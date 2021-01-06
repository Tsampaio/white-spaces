import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import './Checkout.css';
import SecondHeader from '../partials/SecondHeader';
import { payAction, processPayment, findCouponIdAction } from '../../actions/payments';
import { removeCheckout, loadCheckout } from '../../actions/courses';

const Membership = () => {

  const dispatch = useDispatch();

  const payment = useSelector(state => state.payment);
  const auth = useSelector(state => state.auth);

  const { coupon, checkoutPrice, checkout } = payment;

  const [data, setData] = useState({
    instance: {}
  });

  const [paymentState, setPaymentState] = useState({
    code: "",
    checkoutSale: [],
    finalPrice: 0
  })

  const [disableButton, setDisableButton] = useState(false)

  // console.log( payment );
  const courseTag = payment && payment.checkout[0] && payment.checkout[0].tag;
  // console.log( checkoutPrice);

  useEffect(() => {
    dispatch(payAction(auth.user && auth.user._id, auth.user && auth.token));
    dispatch(loadCheckout(auth.user && auth.user._id));
  }, [auth && auth.user]);

  useEffect(() => {
    setPaymentState({
      ...paymentState,
      checkoutSale: checkout,
      finalPrice: checkoutPrice
    })

    console.log("CHECKOUT PRICE IS SET")
  }, [checkoutPrice]);

  const couponIsValid = () => {
    const today = new Date();
    const couponDate = new Date( coupon.date );
    const dateInPast = function (future, present) {
      if (future.setHours(0, 0, 0, 0) <= present.setHours(0, 0, 0, 0)) {
        return true;
      }
      return false;
    };
    console.log("Date in past")
    console.log(dateInPast(couponDate, today ))

    return coupon.active && coupon.available > 0 && !dateInPast(couponDate, today )
  }

  useEffect(() => {

    if(couponIsValid()) {
      console.log("Updating coupon ++++++++");

      const validCourses = [];
      const checkoutCopy = [...checkout];
      console.log(checkoutCopy);
      for(let i=0; i < checkoutCopy.length; i++) {
        for(let j=0; j < coupon.courses.length; j++) {
          if(checkoutCopy[i]._id ==  coupon.courses[j].courseId) {
            checkoutCopy[i].price = coupon.amountType === "percentage" ? (
              parseInt(checkoutCopy[i].price) - parseInt(checkoutCopy[i].price) * parseInt(coupon.amount) / 100
            ) :  parseInt(checkoutCopy[i].price) - parseInt(coupon.amount)
            
          } 
          
        }
        // validCourses.push(checkoutCopy[i]);
      }
      console.log(checkout);
      console.log(coupon.courses);
      console.log(validCourses);

      const finalPriceWithDiscount = checkoutCopy.reduce( (total, course) => {
        return parseFloat(total.price) + parseFloat(course.price);
      })

      console.log(checkout);
     
      setPaymentState({
        ...paymentState,
        checkoutSale: checkoutCopy,
        finalPrice:  finalPriceWithDiscount
      })
    }
    
  }, [coupon]);

  const buy = () => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
      .then(async data => {
        console.log(data);
        nonce = data.nonce

        // console.log('send nonce and total to process ', nonce);
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: checkoutPrice
        }

        // processPayment(userId, token, paymentData)
        // processPayment('131asdasd', 'adasdadad', paymentData)

        await dispatch(processPayment(auth.user, auth.token, paymentData, courseTag));

        console.log("before redirect");
        // console.log( payment.result );
        // console.log( payment.result.success );

        setDisableButton(true);
      })
      .catch(error => {
        console.log('dropin error: ', error)
      })
  }

  const showDropIn = () => (
    payment.paymentToken && <Fragment>
      <DropIn options={{
        authorization: payment.paymentToken,
        paypal: {
          flow: "vault"
        }
      }} onInstance={instance => (data.instance = instance)} />
      <button onClick={buy} className={disableButton ? "btn btn-primary invisible" : "btn btn-primary"}>Proceed to Payment</button>
    </Fragment>
  )

  const checkoutItems = checkout.map((course, i) => {
    return (
      <div className="courseInCheckout" key={i}>
        <div>
          <span className="courseDelete" onClick={() => refreshCheckout(course._id, auth.user._id)}><i className="fas fa-trash"></i></span>
          <h3 className="checkoutCourse">{course.name}</h3>
        </div>
        <span className="coursePrice">${course.price}</span>
      </div>
    );
  });

  const refreshCheckout = async (courseId, userId) => {
    await dispatch(removeCheckout(courseId, userId));
    loadCheckout(userId);
  }
  console.log(auth && auth.user && !auth.user.authenticated);

  if (auth && !auth.isAuthenticated && !auth.loading) {
    console.log("inside register redirect ");
    return <Redirect to="/register" />
  }
  //Redirect if payment success

  // console.log(auth.user);
  // console.log( auth.token );
  // console.log(data);
  // console.log(paymentState);

  const checkCoupon = () => {
    dispatch(findCouponIdAction(paymentState.code));
  }

  // const finalPrice = () => {
  //   if(coupon && coupon.active) {
  //     setPaymentState({
  //       finalPrice:  coupon.amountType === "percentage" ? (
  //         payment.checkoutPrice - payment.checkoutPrice * coupon.amount
  //       ) :  payment.checkoutPrice - coupon.amount
  //     })
  //   }
  // }

  console.log(checkout)
  console.log(paymentState)

  if (payment && payment.result) {
    console.log("inside of redirect to success");
    return <Redirect to="/cart/checkout/success" />
  }
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
            ) : null
            }
            <div className={payment && payment.checkout.length > 0 ? "col-6 paper-gray" : "col-8 offset-md-2 paper-gray "}>
              <h1 className="basketTitle">Products in Basket:</h1>
              {checkoutItems.length > 0 ? checkoutItems : <Fragment><h1>Your basket is empty</h1> <Link to="/courses">Continue shopping</Link></Fragment>}

              {checkoutItems.length > 0 ? (
                <>
                  {couponIsValid() ? (
                    <h4>Coupon {coupon.code}, {coupon.name} applied</h4>) : coupon.name ? (
                      <h4>Coupon is not available</h4>
                    ) : null
                  }
                  <div className="checkoutPrice">Total: {couponIsValid() ? <del>${checkoutPrice}</del> : null } ${paymentState.finalPrice}</div>
                  <input required type="text" placeholder="Enter coupon code" onChange={(e) => setPaymentState({...paymentState, code: e.target.value})}/>
                  <button onClick={checkCoupon}>Use coupon</button>
                </>
              ) : null}

            </div>

          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Membership;
