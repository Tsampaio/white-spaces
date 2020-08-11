import React, { Fragment, useState, useEffect } from 'react';
import { connect} from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import './Checkout.css';
import SecondHeader from '../partials/SecondHeader';
import store from '../../store';
import { payAction, processPayment } from '../../actions/payments'; 
import { removeCheckout, loadCheckout } from '../../actions/courses'; 

const Membership = ({payAction, payment, processPayment, auth, removeCheckout, loadCheckout}) => {
  const [data, setData ] = useState({
    instance: {}
  });

  console.log( payment );
  const checkoutPrice = payment && payment.checkoutPrice;
  const courseTag = payment && payment.checkout[0] && payment.checkout[0].tag;
  console.log( checkoutPrice);

  useEffect( () => {
    payAction(auth.user && auth.user._id, auth.user && auth.token);
    loadCheckout(auth.user && auth.user._id);
  }, [auth]);

  const buy = () => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
    .then( async data => {
      console.log(data);
      nonce = data.nonce

      // console.log('send nonce and total to process ', nonce);
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: checkoutPrice
      }

      // processPayment(userId, token, paymentData)
      // processPayment('131asdasd', 'adasdadad', paymentData)
      
      await processPayment(auth.user, auth.token, paymentData, courseTag);

      console.log( "before redirect" );
      // console.log( payment.result );
      // console.log( payment.result.success );
      

    })
    .catch(error => {
      console.log('dropin error: ', error)
    })
  }

  const showDropIn = () => (
    payment.paymentToken && <Fragment>
      <DropIn options ={{ 
        authorization: payment.paymentToken,
        paypal: {
          flow: "vault"
        }
      }} onInstance={ instance => (data.instance = instance)} />
      <button onClick={buy} className="btn btn-primary">Proceed to Payment</button>
    </Fragment>
  )
  


  const checkoutItems = payment && payment.checkout.map( (course, i) => {
   
    return (
      <div className="courseInCheckout" key={i}>
        <div>
          <span className="courseDelete" onClick={() => refreshCheckout(course._id, auth.user._id )}><i className="fas fa-trash"></i></span>
          <h3 className="checkoutCourse">{course.name}</h3>
        </div>
        <span className="coursePrice">${course.price}</span>
      </div>
    );
  });

  const refreshCheckout = async (courseId, userId) => {
    await removeCheckout(courseId, userId )
    loadCheckout(userId);
  }
  console.log( auth && auth.user && !auth.user.authenticated );

  if( auth && !auth.isAuthenticated && !auth.loading) {
    console.log( "inside register redirect ");
    return <Redirect to="/register" />
  }
  //Redirect if payment success

  // console.log(auth.user);
  // console.log( auth.token );
  // console.log(data);
  console.log(payment);

  if( payment && payment.result) {
    console.log("inside of redirect to success");
    return <Redirect to="/cart/checkout/success" /> 
  }
  return (
    <Fragment>
      <SecondHeader />
      <div className="checkoutCtn">
        <div className="container">
          <div className="row">
          { payment && payment.checkout.length > 0 ? (
            <div className="col-6">
              <div className="paymentCtn">
                <h1>Confirm your purchase</h1>
                {showDropIn()}
              </div>
            </div>
            ) : null
          }
            <div className={ payment && payment.checkout.length > 0 ? "col-6 paper-gray" : "col-8 offset-md-2 paper-gray " }>
              <h1 className="basketTitle">Products in Basket:</h1>
              { checkoutItems.length > 0 ? checkoutItems : <Fragment><h1>Your basket is empty</h1> <Link to="/courses">Continue shopping</Link></Fragment> }
              { checkoutItems.length > 0 ? <div className="checkoutPrice">Total: ${payment.checkoutPrice}</div> : null }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  payment: state.payment,
  auth: state.auth
})

export default connect(mapStateToProps, { 
  payAction, processPayment, removeCheckout, loadCheckout })(Membership);
