import React, { useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { checkMembership, cancelMembership, membershipResubscribe } from '../../actions/membership';
import { getBilling } from '../../actions/payments';
import './Profile.css';

function ProfileBilling() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const payment = useSelector(state => state.payment);
  
  useEffect(() => {

    dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    // console.log("before check membership ");
    if (auth && auth.user && auth.user.membership && auth.user.membership.customerId) {
      dispatch(checkMembership(auth.token));
    }

    dispatch(getBilling());

    // console.log(auth);
  }, [auth && auth.user && auth.user._id]);
 
  const userBilling = payment && payment.billing && payment.billing.map((bill) => {
    const date = new Date(bill.date);
    const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return (
      <div key={bill._id} className="row billingRow">
        <div className="col-2"><h4>{newDate}</h4></div>
        <div className="col-3"><h4>{bill.productName}</h4></div>
        <div className="col-3"><h4>{bill._id}</h4></div>
        <div className="col-2"><h4>${bill.price}</h4></div>
      </div>
    )
  });

  const untilDate = new Date(auth && auth.membership.paidThroughDate);
  const newUntilDate = `${untilDate.getDate()}/${untilDate.getMonth() + 1}/${untilDate.getFullYear()}`;

  return (
    <div className="col-lg-9 col-md-12 col-sm-12 billingCtn">
      <div className="card">
        <div className="card-header">
          Membership Details
        </div>
        <div className="card-body">
          {auth && auth.membership && !auth.membership.active && (
            <h3><b>Membership Status:</b> Not active</h3>
          )}
          {auth && auth.membership.active && (
            <>
              <h3><b>Membership Status:</b> {auth && auth.membership.status}</h3>
              <h3><b>Membership Valid Until:</b> {newUntilDate}</h3>
            </>
          )}
          {auth && auth.membership.status === "Active" && (
            <button className="cancelMembership" onClick={() => dispatch(cancelMembership(auth && auth.token))}>Cancel Membership</button>
          )}
          {auth && auth.membership.status === "Canceled" && auth && auth.user &&
            auth.user.membership && auth.user.membership.billingHistory && auth.user.membership.billingHistory.length > 0 && (
              <button onClick={() => dispatch(membershipResubscribe(auth && auth.token))} className="actionButton">Resubscribe</button>
            )}
          {auth && auth.membership && auth.membership.status === "Failed" && (
            <Link to="/membership">Add a new payment method</Link>
          )}
        </div>
      </div>

      <h2><b>Billing History</b></h2>
      <div className="userBillingCtn">
        <div className="billingScroll">
          <div className="row userBillingHistoryTitle">
            <div className="col-2"><h4>Date - dd/mm/yyyy</h4></div>
            <div className="col-3"><h4>Product Name</h4></div>
            <div className="col-3"><h4>Order Number</h4></div>
            <div className="col-2"><h4>Sale Price</h4></div>
          </div>
          <hr />
          {userBilling}
        </div>
      </div>
    </div>
  );
};

export default ProfileBilling;
