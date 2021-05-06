import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';
import DropIn from 'braintree-web-drop-in-react';
import SecondHeader from '../partials/SecondHeader';
import { payAction, membershipPayment } from '../../actions/payments';
import { Card, Form, Button } from 'react-bootstrap';
import './MembershipCheckout.css';

const MembershipCheckout = ({history}) => {
  
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { loading, isAuthenticated, user, token } = auth;

  const payment = useSelector((state) => state.payment);
  const { paymentToken, buttonLoading, paymentComplete } = payment;
  
  const [data, setData] = useState({
    instance: {}
  });

  const { duration } = useParams();

  useEffect(() => {
    dispatch(payAction());
  }, []);

  useEffect(() => {
    console.log("Loading is: ", !loading);
    console.log("isAuthenticated is ", !isAuthenticated);
		if(!loading && !isAuthenticated) {
			history.push('/register');
		}
	}, [history, loading, isAuthenticated])

  const buy = (membershipDuration) => {
    let nonce;
    let getNonce = data.instance.requestPaymentMethod()
      .then(data => {
        console.log("Buy data is:")
        console.log(data);
        nonce = data.nonce

        // console.log('send nonce and total to process ', nonce);
        const paymentData = {
          paymentMethodNonce: nonce
        }

        // processPayment(userId, token, paymentData)
        dispatch(membershipPayment(user, token, paymentData, membershipDuration));
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
        buttonLoading ? (
          <button disabled className="btn membershipPay">
            <div className="spinner-border spinner" role="status">
              <span className="sr-only">Processing payment...</span>
            </div>
            Processing payment...
          </button>
        ) : (
          duration === "monthly" ? (        
            <button onClick={() => buy("monthly")} className="membershipPay">Finish Payment</button>
          ) : (
            <button onClick={() => buy("yearly")} className="membershipPay">Finish Payment</button>
          )
        )
      }
    </Fragment>
  )
  console.log(duration)
  
  if(paymentComplete) {
    history.push("/membership/success");
  }

  return (
    <Fragment>
      <SecondHeader />
      <div className="MembershipCheckoutCtn">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <Card>
              <Card.Header>
                <h1 className="membershipCheckoutTitle">{ duration === "monthly" ? "Monthly Subscription" : "Yearly Subscription"}</h1>
              </Card.Header>
              <div className="paypal membershipCard">
                
                {/* <div className="discountCtn">
                    <Form.Control
                        placeholder="Enter coupon code"
                    />
                    <Button>Apply</Button>
                </div> */}
                
                <div className="MembershipTotal">
                  <span>Total to pay:</span>
                  <span>${ duration === "monthly" ? "20" : "120"} USD</span>
                </div>
                <p className="membershipChargingTime">{ duration === "monthly" ? "Billed once a month" : "Billed once a Year"}</p>
                {showDropIn()}
              </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  )
}

export default MembershipCheckout;