import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../utils/Loader';
import './Profile.css';

function ProfileSidebar( ) {

  const auth = useSelector(state => state.auth);
  const { loading } = auth;

  let userPic = null;
  // const images = require.context('../../images/', true);
  const images = require.context('../../../../uploads/users/', true);

  let img;

  try {
    // img = images(`./${auth.user._id}.jpg`);
    img = auth && auth.user && auth.user.image;
    userPic = <img src={img} className="userAvatar" alt="User Profile"/>
  } catch (error) {
    img = images(`./default.png`);
    userPic = <img src={img.default} className="userAvatar" alt="User Profile"/>
  }

  console.log(`/uploads/users/${auth && auth.user && auth.user.image}`);
  return (
    <div className="col-xl-2 col-lg-3 col-md-4 userLeftCol">
      { loading ? <Loader /> : userPic }
      <h3>{auth && auth.user && auth.user.name}</h3>
      <h4>{auth && auth.user && auth.user.email}</h4>

      <ul className="profileLinks">
        <li>
          <NavLink exact to="/profile" activeClassName="activeProfilePage"><i className="fa fa-user"></i>USER PROFILE</NavLink>
        </li>
        <li>
          <NavLink to="/profile/courses" activeClassName="activeProfilePage"><i className="fa fa-graduation-cap"></i>MY COURSES</NavLink>
        </li>
        <li>
          <NavLink to="/profile/billing" activeClassName="activeProfilePage"><i className="far fa-credit-card"></i>BILLING</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
