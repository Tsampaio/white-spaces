import React, {Fragment} from 'react';
import SecondHeader from '../partials/SecondHeader';

const CheckoutSuccess = () => {
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

export default CheckoutSuccess;
