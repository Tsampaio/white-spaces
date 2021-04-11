import React, { useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import {
  checkMembership,
  cancelMembership,
  membershipResubscribe,
} from '../../actions/membership';
import { getBilling } from '../../actions/payments';
import './Profile.css';

function ProfileBilling() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, membership, buttonLoading } = auth;
  const payment = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    // console.log("before check membership ");
    if ( user && user.membership && user.membership.customerId
    ) {
      dispatch(checkMembership(auth.token));
    }

    dispatch(getBilling());

    // console.log(auth);
  }, [user]);

  const userBilling =
    payment &&
    payment.billing &&
    payment.billing.map((bill, i) => {
      const date = new Date(bill.date);
      const newDate = `${('0' + date.getDate()).slice(-2)}/${
        ('0' + (date.getMonth() + 1)).slice(-2)
      }/${date.getFullYear()}`;

      return (
        <tr key={bill._id}>
          <td>{newDate}</td>

          <td>{bill.productName.length > 1 ? (
            bill.productName.map((product, i) => (
              <span>{product}{(i === bill.productName.length - 1) ? "" : <br />}</span>
            ))
          ): bill.productName}</td>

          <td>{bill._id}</td>

          <td>${bill.price}</td>
        </tr>
      );
    });

  const billingDateParser = (dateToParse) => {
    const untilDate = new Date(dateToParse);
    return `${('0' + untilDate.getDate()).slice(-2)}/${('0' + (untilDate.getMonth() + 1)).slice(-2)}/${untilDate.getFullYear()}`
  }

  return (
    <div className="col-lg-9 col-md-12 col-sm-12 billingCtn">
      <div className="card">
        <div className="card-header">Membership Details</div>
        <div className="card-body">
          {auth && auth.membership && !auth.membership.active && (
            <h3>
              <b>Membership Status:</b> Not active
            </h3>
          )}
          {membership && membership.active && (
            <>
              <h3>
                <b>Membership Status:</b> {membership && membership.status}
              </h3>
              <h3>
                { membership && membership.status === "Active" ? (
                  <>
                    <b>Next billing date: </b> 
                    {billingDateParser(membership && membership.nextBillingDate)}
                  </>
                ) : (
                  <>
                  <b>Membership Valid Until: </b> 
                  {billingDateParser(membership && membership.paidThroughDate)}
                  </>
                )}
              </h3>
            </>
          )}
          {membership && membership.status === 'Active' && (
            <>
              {buttonLoading ? (
                <button className="btn btn-info">
                  <div class="spinner-border spinner" role="status">
                    <span class="sr-only">Processing payment...</span>
                  </div>
                  Cancelling...
                </button>
              ) : (
                <button
                  className="btn btn-info"
                  onClick={() => dispatch(cancelMembership(auth && auth.token))}
                >
                  Cancel Membership
                </button>
              )}
            </>
          )}
          {auth &&
            auth.membership.status === 'Canceled' &&
            auth &&
            auth.user &&
            auth.user.membership &&
            auth.user.membership.billingHistory &&
            auth.user.membership.billingHistory.length > 0 && (
              <button
                onClick={() =>
                  dispatch(membershipResubscribe(auth && auth.token))
                }
                className="actionButton"
              >
                Resubscribe
              </button>
            )}
          {auth && auth.membership && auth.membership.status === 'Failed' && (
            <Link to="/membership">Add a new payment method</Link>
          )}
        </div>
      </div>

      <h2>
        <b>Billing History</b>
      </h2>
      <div className="userBillingCtn">
        <Table striped bordered hover responsive size="sm">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th className="productName">Product Name</th>
              <th>Order Number</th>
              <th>Sale Price</th>
            </tr>
          </thead>
          <tbody>{userBilling}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default ProfileBilling;
