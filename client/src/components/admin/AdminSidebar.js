import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../utils/Loader';
import './Admin.css';

function AdminSidebar( ) {

  const auth = useSelector(state => state.auth);
  const { loading } = auth;

  let userPic = null;
  // const images = require.context('../../images/', true);
  const images = require.context('../../../../uploads/users/', true);

  let img;

  if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
    img = images(`./${auth.user._id}.jpg`);
    userPic = <img src={img.default} className="userAvatar" alt="user avatar" />
  } else {
    img = images(`./default.png`);
    userPic = <img src={img.default} className="userAvatar" alt="user avatar" />
  }

  return (
    <div className="col-xl-2 col-lg-3 col-md-4 userLeftCol">
      { loading ? <Loader /> : userPic }
      <h3>{auth && auth.user && auth.user.name}</h3>
      <h4>{auth && auth.user && auth.user.email}</h4>

      <ul className="profileLinks">
        <li>
          <NavLink exact to="/admin/courses" activeClassName="activeProfilePage"><i className="fa fa-graduation-cap"></i>Courses</NavLink>
        </li>
        <li>
          <NavLink to="/admin/featureCourses" activeClassName="activeProfilePage"><i className="fa fa-graduation-cap"></i>FEATURE COURSES</NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" activeClassName="activeProfilePage"><i className="fa fa-user"></i>Users</NavLink>
        </li>
        <li>
          <NavLink to="/admin/sales" activeClassName="activeProfilePage"><i className="fa fa-comment-dollar"></i>Sales</NavLink>
        </li>
        <li>
          <NavLink to="/admin/coupons" activeClassName="activeProfilePage"><i className="fa fa-percent"></i>Coupons</NavLink>
        </li>
        <li>
          <NavLink to="/admin/memberships" activeClassName="activeProfilePage">
            <i className="far fa-credit-card"></i>Memberships
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
