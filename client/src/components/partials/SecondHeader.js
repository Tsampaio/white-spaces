import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SecondHeader.css';
import logo from '../../images/telmo-academy1.png';
import { loadCheckout } from '../../actions/courses';
import { checkMembership } from '../../actions/membership';
import { connect } from 'react-redux';

const SecondHeader = ({ auth, isAuthenticated, payment, loadCheckout, checkMembership }) => {

  let userPic = null;

  const [dropDown, setDropdown] = useState({
    open: false,
  });

  const dropMenu = React.useRef();
  const profileIcon = React.useRef();

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (dropMenu.current && !dropMenu.current.contains(event.target) && !profileIcon.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        // console.log("outside");
        setDropdown(false)
      } else {
        // console.log("inside");
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropMenu]);

  useEffect(() => {
    if (auth && auth.isAuthenticated) {
      loadCheckout(auth && auth.user && auth.user._id);
    }

  }, [auth && auth.isAuthenticated && auth.user && auth.user.checkout]);

  useEffect(() => {
    // console.log("loading check")
    // console.log(auth && auth.token)
    if (auth && auth.token) {
      checkMembership(auth && auth.token);
    }

  }, [auth && auth.isAuthenticated]);


  const handleDropdown = () => {
    if (!dropDown.open) {
      setDropdown({
        open: true
      })
    } else {
      setDropdown({
        open: false
      })
    }
  }

  const images = require.context('../../images/', true);

  if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
    // import Pic from `/${auth.user._id}.jpg`;
    // userPic = <img src={`/${auth.user._id}.jpg`} />

    // console.log("before image");

    let img = images(`./${auth && auth.user && auth.user._id}.jpg`);
    userPic = <img src={img} className="userAvatarNav" />;
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
              {/* Add when all finished
            { auth && auth.membership && !auth.membership.active && (
              <li><Link to='/membership'>PRICING</Link></li>

            )} */}
              <li><Link to='/membership'>PRICING</Link></li>
              {isAuthenticated ? (

                <div ref={dropMenu} className={dropDown.open ? "navDropDown" : "hideDropDown"}>
                  <li><Link to='/profile'><i className="fa fa-user"></i> Profile</Link></li>
                  <li><Link to='/profile/courses'><i className="fa fa-play-circle"></i> My Courses</Link></li>
                  { auth && auth.user && auth.user.role === "admin" ? <li><Link to='/admin/courses'><i className="fas fa-user-shield"></i> Admin</Link></li> : ""}
                  <li><Link to='/logout'><i className="fa fa-door-open"></i> Logout</Link></li>
                </div>

              ) : (
                  <Fragment>
                    <li><Link to='/login'>Login</Link></li>
                    <li><Link to='/Register'>Register</Link></li>
                  </Fragment>
                )}
              {
                isAuthenticated ? (
                  <li>
                    <Link className="checkoutLink" to="/cart/checkout">
                      <i className="fa fa-shopping-cart"></i>
                      {payment && payment.checkout && payment.checkout.length > 0 ? (
                        <span className="checkoutNumber">{payment && payment.checkout && payment.checkout.length}</span>
                      ) : null
                      }
                    </Link>
                  </li>
                ) : null
              }
              {isAuthenticated ? <li ref={profileIcon} className="userAvatarNavCtn" onClick={handleDropdown}>{userPic}<span className="userBorder"></span></li> : ""}
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

export default connect(mapStateToProps, { loadCheckout, checkMembership })(SecondHeader);