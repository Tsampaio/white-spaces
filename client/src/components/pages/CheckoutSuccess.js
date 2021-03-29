import React, { useState, useEffect} from 'react';
import SecondHeader from '../partials/SecondHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { resetPaymentResult } from '../../actions/payments';
import { Redirect, Link } from 'react-router-dom';
import { Card } from 'react-bootstrap'
import './CheckoutSuccess.css';

const CheckoutSuccess = ({ history }) => {
  const dispatch = useDispatch();
  const payment = useSelector(state => state.payment);

  const { result } = payment;

  // const [page, setPage] = useState({
  //   loaded: false
  // });

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    // store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);

    

    if(!result) {
      history.push("/courses");
    }

    dispatch(resetPaymentResult());
    
  }, []);

  // useEffect(() => {
  //   if( auth && auth.isAuthenticated ) {
  //     setPage({
  //       loaded: true
  //     })
  //   }
    
  // }, [auth && auth.isAuthenticated]);

  // if( auth && !auth.isAuthenticated && page.loaded) {
  //   return <Redirect to="/" />
  // }

  return (
    <>
      <SecondHeader />
      <div className="checkoutSuccessCtn">
      <div className="container">
        <div className="row">
          <div className="col-12 checkoutSuccess">
            <Card>
              <Card.Header></Card.Header>
              <Card.Body>
                <h1>Thank you! Your Order is Complete</h1>
                <p>You will receive an email confirmation shortly.</p>
                <Link className="btn checkoutSuccessBtn" to="/courses">Start Learning</Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

// const mapStateToProps = state => ({
//   auth: state.auth,
//   active: state.auth.active,
//   courses: state.courses,
//   payment: state.payment
// });

export default CheckoutSuccess;
