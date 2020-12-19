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
  const { _id, name, email, joined, active, purchases } = admin.userDetails;
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

  const date = new Date(joined);
  const uerJoined = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const allPurchases = userPurchases.map((purchase, i) => {
    const date = new Date(purchase.date);
    const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
      <tr key={i}>
        <td>{newDate}</td>
        <td>{purchase.price}</td>
        <td>None</td>
        <td>{purchase.price}</td>
        <td>{purchase.productName}</td>
      </tr>
    )
  });

  // const totalPurchases = userPurchases.reduce((purchase, i) => {

  // });

  return (
    <>
      <div className="adminCtn col-xl-10">
        <div className="row">
          <div className="col-2">
            <img className="userAvatar" src={img.default} style={{ width: "100%" }} />
          </div>
          <div className="col-10">
            <div className="card userCard">
              <div className="userColDivider">
                <h6>Name</h6>
                <h4>{name}</h4>
              </div>
              <div className="userColDivider">
                <h6>Email</h6>
                <h4>{email}</h4>
              </div>
              <div className="userColDivider">
                <h6>Profile Status</h6>
                <h4>{active}</h4>
              </div>
              <div className="userColDivider">
                <h6>Account Created</h6>
                <h4>{uerJoined}</h4>
              </div>
              <div className="userColDivider">
                <h6>Last Login</h6>
                <h4>Today</h4>
              </div>
              <div className="userColDivider">
                <h6>Total Purchases</h6>
                <h4>${purchases} USD</h4>
              </div>
            </div>
            
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h4>Purchase History</h4>
          </div>
          <div className="col-10">
            <table>
              <tr>
                <th>DATE</th>
                <th>FULL PRICE</th>
                <th>DISCOUNTS</th>
                <th>SALE PRICE</th>
                <th>PRODUCT</th>
              </tr>
              
              {allPurchases.reverse()}

            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Courses;