import React, {Fragment, useEffect} from 'react';
import SecondHeader from '../partials/SecondHeader';
import { getCoursesOwned } from '../../actions/courses';
import { resetPaymentResult } from '../../actions/payments';
import { connect } from 'react-redux';
import store from '../../store';

const MembershipSuccess = ({auth, payment}) => {

  return (
    <Fragment>
      <SecondHeader />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Your membership is now active</h1>
            <h1>You will receive an email soon</h1>
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

export default connect(mapStateToProps)(MembershipSuccess);
