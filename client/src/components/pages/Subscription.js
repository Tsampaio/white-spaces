import React, { Fragment, useState, useEffect } from 'react';
import { connect} from 'react-redux';
import DropIn from 'braintree-web-drop-in-react';
import store from '../../store';
import { payAction, subscriptionPayment } from '../../actions/payments'; 

const Subscription = ({payAction, paymentToken, subscriptionPayment}) => {
  const [data, setData ] = useState({
    instance: {}
  });

  useEffect( () => {
    payAction();
  }, []);

  const buy = () => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
    .then( data => {
      console.log(data);
      nonce = data.nonce

      // console.log('send nonce and total to process ', nonce);
      const paymentData = {
        paymentMethodNonce: nonce
      }

      // processPayment(userId, token, paymentData)
      subscriptionPayment('131asdasd', 'adasdadad', paymentData)
    })
    .catch(error => {
      console.log('dropin error: ', error)
    })
  }

  const showDropIn = () => (
    paymentToken && <Fragment>
      <DropIn options ={{ 
        authorization: paymentToken,
        paypal: {
          flow: "vault"
        }
      }} onInstance={ instance => (data.instance = instance)} />
      <button onClick={buy} className="btn btn-success">Proceed to Payment</button>
    </Fragment>
  )
      console.log(data)
  return (
    <div className="container">
      <div className="paypal">
        <h1>Inside Subscriptions</h1>
        {showDropIn()}
      
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  paymentToken: state.payment.paymentToken
})

export default connect(mapStateToProps, { payAction, subscriptionPayment })(Subscription);