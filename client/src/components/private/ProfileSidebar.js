import React, { useEffect, Fragment, useState, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import './Profile.css';

function ProfileSidebar({ auth }) {

  const [page, setPage] = useState({
    loaded: false,
    showImagePreview: false
  });

  useEffect(() => {
    // loaderDelay();
  }, []);

  // const loaderDelay = () => {
  //   setTimeout(() => {
  //     setPage({ ...page, loaded: true })
  //   }, 500);
  // }

  let userPic = null;
  const images = require.context('../../images/', true);

  let img;

  if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
    img = images(`./${auth.user._id}.jpg`);
    userPic = <img src={img} className="userAvatar" onLoad={() => setPage({loaded: true})} />
  } else {
    img = images(`./default.png`);
    userPic = <img src={img} className="userAvatar" onLoad={() => setPage({loaded: true})} />
  }

  return (
    <div className="col-xl-2 col-lg-3 col-md-4 userLeftCol">
      {!page.loaded && 
        <div className="preLoaderProfilePic">
          <div className="spinner-border " role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      {userPic}
      <h3>{auth && auth.user && auth.user.name}</h3>
      <h4>{auth && auth.user && auth.user.email}</h4>

      <ul className="profileLinks">
        <li>
          {/* <i className="fa fa-user"></i> */}
          <NavLink exact to="/profile" activeClassName="activeProfilePage"><i className="fa fa-user"></i>USER PROFILE</NavLink>
        </li>
        <li>
          <NavLink to="/profile/courses" activeClassName="activeProfilePage"><i className="fa fa-graduation-cap"></i>COURSES PURCHASED</NavLink>
        </li>
        <li>
          <NavLink to="/profile/billing" activeClassName="activeProfilePage"><i className="far fa-credit-card"></i>BILLING</NavLink>
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ProfileSidebar);
