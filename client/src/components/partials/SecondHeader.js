import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './SecondHeader.css';
import logo from '../../images/telmoacademy-logo2.png';
import { connect } from 'react-redux';

const SecondHeader = ({ isAuthenticated }) => {
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
    </div>
  )
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(SecondHeader);
