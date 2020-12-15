import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../actions/auth';
import { getUserPurchases } from '../../actions/admin';
// import './Courses.css'
import './UserProfile.css'

const Courses = ({ match, history }) => {
  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin);
  const { userPurchases } = admin;
  const { _id, name, email } = admin.userDetails;
  console.log(_id)
  const { subPage } = useParams();
  console.log(subPage);

  useEffect(() => {
    dispatch(getUserDetails(subPage));
    dispatch(getUserPurchases(subPage));
  }, []);

  const images = require.context('../../images/', true);
  let img;
  try {
    img = images(`./${subPage}.jpg`);
  } catch (error) {
    img = images(`./default.png`);
  }

  return (
    <>
      <div className="adminCtn col-xl-10">
        <div className="row">
          <div className="col-2">
            <img src={img.default} style={{ width: "100%" }} />
          </div>
          <div className="col-10">
            <h6>Name</h6>
            <h1>{name}</h1>
            <h6>Email</h6>
            <h1>{email}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h1>Purchase History</h1>
          </div>
          <div className="col-10">
            <table>
              <tr>
                <th>DATE</th>
                <th>FULL PRICE</th>
                <th>DISCOUNTS</th>
                <th>EARNINGS (USD)</th>
                <th>PRODUCT</th>
              </tr>
              
              {
                userPurchases.map(purchase => {
                  return (
                    <tr>
                      <td>Today</td>
                      <td>{purchase.price}</td>
                      <td>None</td>
                      <td>{purchase.price}</td>
                      <td>{purchase.productName}</td>
                    </tr>
                  )
                })
              }

            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Courses;