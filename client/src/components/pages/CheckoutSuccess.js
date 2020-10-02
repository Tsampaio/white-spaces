import React, {Fragment, useState, useEffect} from 'react';
import SecondHeader from '../partials/SecondHeader';
import { getCoursesOwned } from '../../actions/courses';
import { resetPaymentResult } from '../../actions/payments';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import store from '../../store';
import './CheckoutSuccess.css';

const CheckoutSuccess = ({auth, payment}) => {

  const [page, setPage] = useState({
    loaded: false
  });

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    store.dispatch(resetPaymentResult());
    // console.log(auth);
    
  }, []);

  useEffect(() => {
    if( auth && auth.isAuthenticated ) {
      setPage({
        loaded: true
      })
    }
    
  }, [auth && auth.isAuthenticated]);

  if( auth && !auth.isAuthenticated && page.loaded) {
    return <Redirect to="/" />
  }

  return (
    <Fragment>
      <SecondHeader />
      <div className="container checkoutSuccessCtn">
        <div className="row">
          <div className="col-12 checkoutSuccess">
            <h1>Thank you! Your Order is Complete</h1>
            <h4>You will receive an email confirmation shortly.</h4>
            <Link className="checkoutSuccessBtn" to="/courses">Start Learning</Link>

          </div>
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  active: state.auth.active,
  courses: state.courses,
  payment: state.payment
});

export default connect(mapStateToProps)(CheckoutSuccess);
