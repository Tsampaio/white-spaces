import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SecondHeader.css';
import logo from '../../images/telmoacademy-logo3.png';
import { loadCheckout } from '../../actions/courses'; 
import { connect } from 'react-redux';

const SecondHeader = ({ auth, isAuthenticated, payment, loadCheckout }) => {

  let userPic = null;

  const [dropDown, setDropdown] = useState({
    open: false,
  });

  useEffect(() => {
    loadCheckout(auth.user && auth.user._id);
  }, [auth])
  

  const handleDropdown = () => {
    if (dropDown.open) {
      setDropdown({
        open: false
      })
    } else {
      setDropdown({
        open: true
      })
    }
  }

  const images = require.context('../../images/', true);

  if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
    // import Pic from `/${auth.user._id}.jpg`;
    // userPic = <img src={`/${auth.user._id}.jpg`} />
    
    console.log("before image");

    let img = images(`./${auth.user._id}.jpg`);
    userPic = <img src={img} className="userAvatarNav" />
  } else {
    let img = images(`./default.png`);
    userPic = <img src={img} className="userAvatarNav" />
  }

return (
  <div className="secondHeader">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 mainNav">
          <Link to="/">
            <img src={logo} alt="Telmo Academy Logo" className="logo logo-light" />
          </Link>
          <ul>
            <li><Link to='/'>HOME</Link></li>
            <li><Link to='/courses'>COURSES</Link></li>
            {/* <li><Link to='/membership'>MEMBERSHIP</Link></li> */}
            {isAuthenticated ? (

              <div className={dropDown.open ? "navDropDown" : "hideDropDown"}>
                <li><Link to='/profile'><i className="fa fa-user"></i> Profile</Link></li>
                { auth && auth.user && auth.user.role === "admin" ? <li><Link to='/admin/courses'><i className="fas fa-user-shield"></i> Admin</Link></li> : "" }
                <li><Link to='/logout'><i className="fa fa-door-open"></i> Logout</Link></li>
              </div>

            ) : (
                <Fragment>
                  <li><Link to='/login'>Login</Link></li>
                  <li><Link to='/Register'>Register</Link></li>
                </Fragment>
              )}
            <li>
              <Link className="checkoutLink" to="/cart/checkout">
                <i className="fa fa-shopping-cart"></i>
                {payment && payment.checkout && payment.checkout.length > 0 ? (
                  <span className="checkoutNumber">{payment && payment.checkout && payment.checkout.length}</span>
                ) : null
                }
              </Link>
            </li>
            { isAuthenticated ? <li className="userAvatarNavCtn" onClick={handleDropdown}>{userPic}<span className="userBorder"></span></li> : "" }
          </ul>
        </div>
      </div>
    </div>
  </div>
)
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth,
  payment: state.payment
});

export default connect(mapStateToProps, { loadCheckout })(SecondHeader);
