import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SecondHeader.css';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../images/telmo-academy1.png';
import { loadCheckout } from '../../actions/courses';
import { lastLoginAction } from '../../actions/auth';
import { checkMembership } from '../../actions/membership';

const SecondHeader = () => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { isAuthenticated, membershipLoaded } = auth;

  const payment = useSelector(state => state.payment);
  const { checkoutLoaded } = payment;

  let userPic = null;

  const [dropDown, setDropdown] = useState({
    open: false,
  });

  const [mobileMenu, setMobileMenu] = useState({
    open: false,
  });

  const dropMenu = React.useRef();
  const dropMobileMenu = React.useRef();

  const profileIcon = React.useRef();
  const burgerMenuIcon = React.useRef();

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (dropMenu.current && !dropMenu.current.contains(event.target) && !profileIcon.current.contains(event.target)) {
        // console.log("dropMenu");
        // alert("You clicked outside of me!");
        // console.log("outside");
        setDropdown({
          open: false
        })
      } 
      
      if(dropMobileMenu.current && dropMenu.current && !dropMenu.current.contains(event.target) && !burgerMenuIcon.current.contains(event.target)){
        // console.log("inside dropMobileMenu");
        setMobileMenu({
          open: false
        })
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
    if (auth && auth.isAuthenticated && !checkoutLoaded) {
      dispatch(loadCheckout(auth && auth.user && auth.user._id));
    }

  }, [auth && auth.isAuthenticated && auth.user && auth.user.checkout]);

  useEffect(() => {
    // console.log("loading check")
    // console.log(auth && auth.token)
    if (auth && auth.token) {
      if( !membershipLoaded) {
        dispatch(checkMembership(auth && auth.token));
      }
      dispatch(lastLoginAction());
    }

  }, [auth && auth.isAuthenticated]);


  const handleDropdown = (state, myFunc) => {
    // if (!state.open) {
    //   myFunc({
    //     open: true
    //   })
    // } else {
    //   myFunc({
    //     open: false
    //   })
    // }
    console.log("calling handleDropdown")
    myFunc({
      open: !state.open
    })
  }

  // const images = require.context('../../images/', true, /\.(png|jpe?g|svg)$/);
  const images = require.context('../../../../uploads/users/', true);

  // console.log("+++++++");
  // console.log(images);

  try {
    let img = images(`./${auth && auth.user && auth.user._id}.jpg`);
    
    userPic = <img src={img.default} className="userAvatarNav" alt="user profile" />;
  } catch(error) {
    let img = images(`./default.png`);
    userPic = <img src={img.default} className="userAvatarNav" alt="user profile"/>
  }

  return (
    <>
      <div className="secondHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 mainNav">
              <Link to="/">
                <img src={logo} alt="Telmo Academy Logo" className="logo logo-light" />
              </Link>
              <div className="mobileMenu" onClick={() => handleDropdown(mobileMenu, setMobileMenu)}>
                <i ref={burgerMenuIcon} className="fas fa-bars"></i>
              </div>
              <ul className="desktopMenu">
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
                {isAuthenticated ? <li ref={profileIcon} className="userAvatarNavCtn" onClick={() => handleDropdown(dropDown, setDropdown)}>{userPic}<span className="userBorder"></span></li> : ""}
              </ul>
            </div>

          </div>
        </div>
      </div>
      <div className="navMenuCtn">        
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <ul ref={dropMobileMenu} className={`navMenu ${mobileMenu.open ? "navMenuActive" : ""}`}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/membership">Pricing</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/profile/billing">Billing</Link></li>
              <li><Link to="/profile/courses">My Courses</Link></li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default SecondHeader;