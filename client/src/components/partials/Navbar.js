import React, { Fragment, useEffect, useState } from 'react';
import logo from '../../images/telmoacademy-logo2.png';
import logoDark from '../../images/telmoacademy-logo3.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Navbar.css';

const Navbar = ({ isAuthenticated, classProp }) => {
  const [position, setPosition ] = useState({
    y: 0
  })

  useEffect( () => {
    let addScroll = false;

    if(!addScroll) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      addScroll = true;
    };
    
  }, []);


  const handleScroll = () => {
      let scrollTop = window.pageYOffset;

      // console.log(scrollTop);
    
      setPosition({
        y: scrollTop
      })
  };

  return (
    <nav className={`navContainer ${ position.y > 0 ? classProp : null}`}>
    <div className="container">
		  <div className="row">
        <div className="col-sm-12 mainNav">
          <Link to="/">
            <img src={logo} alt="Telmo Academy Logo" className="logo logo-light"/>
            <img src={logoDark} alt="Telmo Academy Logo" className="logo logo-dark"/>
          </Link>
          <ul>
            <li><Link to='/'>HOME</Link></li>
            <li><Link to='/courses'>COURSES</Link></li>
            <li><Link to='/membership'>MEMBERSHIP</Link></li>
            {isAuthenticated ? (
              <Fragment>
                <li><Link to='/profile'>Profile</Link></li>
                <li><Link to='/logout'>Logout</Link></li>
              </Fragment>
            ) : (
                <Fragment>
                  <li><Link to='/login'>Login</Link></li>
                  <li><Link to='/Register'>Register</Link></li>
                </Fragment>
              )}
            
          </ul>
        </div>
      </div>
		</div>
    </nav>
  )
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Navbar);
