import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SecondHeader.module.css';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../images/telmo-academy1.png';
import { loadCheckout } from '../../actions/courses';
import { lastLoginAction } from '../../actions/auth';
import { checkMembership } from '../../actions/membership';

const SecondHeader = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, membershipLoaded, notification, user } = auth;

  const payment = useSelector((state) => state.payment);
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
    if (mobileMenu.open) {
      // document.body.style.overflow = 'hidden';
      document.body.classList.add(styles.lock);
    } else {
      // document.body.style.overflow = 'unset';
      document.body.classList.remove(styles.lock);
    }
  }, [mobileMenu]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        dropMenu.current &&
        !dropMenu.current.contains(event.target) &&
        !profileIcon.current.contains(event.target)
      ) {
        // console.log("dropMenu");
        // alert("You clicked outside of me!");
        console.log("outside");
        setDropdown({
          open: false,
        });
      }

      if (
        dropMobileMenu.current &&
        !dropMobileMenu.current.contains(event.target) &&
        !burgerMenuIcon.current.contains(event.target)
      ) {
        console.log('inside dropMobileMenu');
        setMobileMenu({
          open: false,
        });
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
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
      if (!membershipLoaded) {
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
    console.log('calling handleDropdown');
    myFunc({
      open: !state.open,
    });
  };

  // const images = require.context('../../images/', true, /\.(png|jpe?g|svg)$/);
  // const images = require.context('../../../../uploads/users/', true);

  // console.log("+++++++");
  // console.log(images);

  let img = auth && auth.user && auth.user.image;

  if (!img) {
    img = '/uploads/users/default.png';
  }

  userPic = (
    <img
      src={img}
      className={styles.userAvatarNav}
      alt="user profile"
    />
  );
  
  const checkoutIcon = isAuthenticated ? (
      <Link className={`${styles.checkoutLink} ${styles.checkoutIcon}`} to="/cart/checkout">
        <i className="fa fa-shopping-cart"></i>
        {payment &&
        payment.checkout &&
        payment.checkout.length > 0 ? (
          <span className={styles.checkoutNumber}>
            {payment &&
              payment.checkout &&
              payment.checkout.length}
          </span>
        ) : null}
      </Link>
  ) : null

  return (
    <>
      <div className={styles.secondHeader}>
        <div className="container">
          <div className="row">
            <div className={`col-sm-12 ${styles.mainNav}`}>
              <Link to="/">
                <img
                  src={logo}
                  alt="Telmo Academy Logo"
                  className={styles.logo}
                />
              </Link>

              <div
                className={styles.mobileMenu}
              >
                { checkoutIcon }
                <i ref={burgerMenuIcon} className="fas fa-bars" onClick={() => handleDropdown(mobileMenu, setMobileMenu)}></i>
              </div>
              <ul className={styles.desktopMenu}>
                <li>
                  <Link to="/courses">COURSES</Link>
                </li>
                {/* Add when all finished
            { auth && auth.membership && !auth.membership.active && (
              <li><Link to='/membership'>PRICING</Link></li>

            )} */}
                <li>
                  <Link to="/membership">MEMBERSHIP</Link>
                </li>
                <li>
                  <a href="https://blog.telmo.academy/" rel="noreferrer" target="_blank">BLOG</a>
                </li>
                {isAuthenticated ? (
                  <div
                    ref={dropMenu}
                    className={
                      dropDown.open ? styles.navDropDown : styles.hideDropDown
                    }
                  >
                    <li>
                      <Link to="/profile">
                        <i className="fa fa-user"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile/courses">
                        <i className="fa fa-play-circle"></i> My Courses
                      </Link>
                    </li>
                    {auth && auth.user && auth.user.role === 'admin' ? (
                      <li>
                        <Link to="/admin/courses">
                          <i className="fas fa-user-shield"></i> Admin
                        </Link>
                      </li>
                    ) : (
                      ''
                    )}
                    <li>
                      <Link to="/logout">
                        <i className="fa fa-door-open"></i> Logout
                      </Link>
                    </li>
                  </div>
                ) : (
                  <Fragment>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/Register">Register</Link>
                    </li>
                  </Fragment>
                )}
                <li>{ checkoutIcon }</li>
                {isAuthenticated ? (
                  <li
                    ref={profileIcon}
                    className={styles.userAvatarNavCtn}
                    onClick={() => handleDropdown(dropDown, setDropdown)}
                  >
                    {userPic}
                    <span className="userBorder"></span>
                  </li>
                ) : (
                  ''
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${styles.navMenuCtn} ${
          mobileMenu.open ? styles.navMenuActive : ''
        }`}
      ></div>
      <div
        className={`${styles.mobileMenuDiv} ${
          mobileMenu.open ? styles.slide : ''
        }`}
        ref={dropMobileMenu}
      >
        <div className={styles.mobileMenuPicCtn}>
          {userPic}
          <div>
            <h3>Hey {user && user.name ? user.name.split(' ')[0] : 'guest'},</h3>
            <p>Welcome back</p>
          </div>
        </div>
        <ul className={styles.navMenu}>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/membership">Membership</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" onClick={() => handleDropdown(mobileMenu, setMobileMenu)}>Profile</Link>
              </li>
              <li>
                <Link to="/profile/courses" onClick={() => handleDropdown(mobileMenu, setMobileMenu)}>My Courses</Link>
              </li>
              <li>
                <Link to="/profile/billing" onClick={() => handleDropdown(mobileMenu, setMobileMenu)}>Billing</Link>
              </li>
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default SecondHeader;
