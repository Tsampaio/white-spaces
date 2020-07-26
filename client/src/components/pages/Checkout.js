import React, { Fragment, useState, useEffect } from 'react';
import { connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
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
  const checkout = payment && payment.checkout[0] && payment.checkout[0].price;
  const courseTag = payment && payment.checkout[0] && payment.checkout[0].tag;
  console.log( checkout);

  useEffect( () => {
    payAction(auth.user && auth.user._id, auth.user && auth.token);
    loadCheckout(auth.user && auth.user._id);
  }, [auth]);

  const buy = () => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
    .then( data => {
      console.log(data);
      nonce = data.nonce

      // console.log('send nonce and total to process ', nonce);
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: checkout
      }

      // processPayment(userId, token, paymentData)
      // processPayment('131asdasd', 'adasdadad', paymentData)
      
      processPayment(auth.user, auth.token, paymentData, courseTag)
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
      <button onClick={buy} className="btn btn-success">Proceed to Payment</button>
    </Fragment>
  )

  const checkoutItems = payment && payment.checkout.map( (course, i) => {
    return (
      <Fragment key={i}>
        <span onClick={() => refreshCheckout(course._id, auth.user._id )}>X</span>
        <h3>{course.name}</h3>
      </Fragment>
    );
  });

  const refreshCheckout = async (courseId, userId) => {
    await removeCheckout(courseId, userId )
    loadCheckout(userId);
  }

  //Redirect if payment success
  if( payment.result && payment.result.success ) {
    return <Redirect to="/cart/checkout/success" /> 
  }
  console.log(auth.user);
  console.log( auth.token );
  console.log(data);
  return (
    <Fragment>
      <SecondHeader />
      <div className="courseCheckout">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h1>Confirm your purchase</h1>
              {showDropIn()}
            </div>
            <div className="col-6 paper-gray">
              { checkoutItems.length > 0 ? checkoutItems : <h1>No Products in the checkout</h1> }
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
