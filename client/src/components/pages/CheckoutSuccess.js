import React, {Fragment, useEffect} from 'react';
import SecondHeader from '../partials/SecondHeader';
import { getCoursesOwned } from '../../actions/courses';
import { connect } from 'react-redux';
import store from '../../store';

const CheckoutSuccess = ({auth}) => {

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    
    // console.log(auth);
  }, []);

  return (
    <Fragment>
      <SecondHeader />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Thank you Your Order is Complete</h1>
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
  courses: state.courses
});

export default connect(mapStateToProps)(CheckoutSuccess);
