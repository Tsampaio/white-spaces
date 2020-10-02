import React, { Fragment, useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import DropIn from 'braintree-web-drop-in-react';
import SecondHeader from '../partials/SecondHeader';
import { payAction, membershipPayment } from '../../actions/payments';
import './MembershipCheckout.css';

const MembershipCheckout = ({ payAction, payment,  paymentToken, auth, membershipPayment }) => {
  const [data, setData] = useState({
    instance: {}
  });

  const { duration } = useParams();

  useEffect(() => {
    payAction();
  }, []);

  const buy = (membershipDuration) => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
      .then(data => {
        console.log(data);
        nonce = data.nonce

        // console.log('send nonce and total to process ', nonce);
        const paymentData = {
          paymentMethodNonce: nonce
        }

        // processPayment(userId, token, paymentData)
        membershipPayment(auth && auth.user, auth && auth.token, paymentData, membershipDuration);
      })
      .catch(error => {
        console.log('dropin error: ', error)
      })
  }

  const showDropIn = () => (
    paymentToken && <Fragment>
      <DropIn options={{
        authorization: paymentToken,
        paypal: {
          flow: "vault"
        }
      }} onInstance={instance => (data.instance = instance)} />
      {
        duration === "monthly" ? (
          <button onClick={() => buy("monthly")} className="membershipPay">Finish Payment</button>
        ) : (
          <button onClick={() => buy("yearly")} className="membershipPay">Finish Payment</button>
        )
      
      }

    </Fragment>
  )
  console.log(duration)
  
  if(payment && payment.paymentComplete) {
    return <Redirect to="/membership/success"/>
  }

  return (
    <Fragment>
      <SecondHeader />
      <div className="MembershipCheckoutCtn">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="paypal">
                <h1>{ duration === "monthly" ? "Monthly Subscription" : "Annual Subscription"}</h1>
                <div className="discountCtn">
                  <input type="text" placeholder="Discound Code"/><button>Apply</button>
                </div>
                
                <div className="MembershipTotal">
                  <span>Total to pay:</span>
                  <span>${ duration === "monthly" ? "24.99" : "179.88"} USD</span>
                </div>
                {showDropIn()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  paymentToken: state.payment.paymentToken,
  payment: state.payment,
  auth: state.auth
})

export default connect(mapStateToProps, { payAction, membershipPayment })(MembershipCheckout);