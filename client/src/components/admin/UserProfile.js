import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getUserDetails } from '../../actions/auth';
import SecondHeader from '../partials/SecondHeader';
import './Courses.css'

const Courses = ({ match, history }) => {
  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin);
  const { _id, name, email } = admin.userDetails;
  console.log(_id)
  const { subPage } = useParams();
  console.log(subPage);

  useEffect(() => {
    dispatch(getUserDetails(subPage));
  }, []);

  const images = require.context('../../images/', true);
  let img;
  try {
    img = images(`./${subPage}.jpg`);
  } catch (error) {
    img = images(`./default.png`);
  }

  return (
    <>
      <div className="adminCtn">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <img src={img.default} style={{width: "100%"}}/>
            </div>
            <div className="col-10">
              <h6>Name</h6>
              <h1>{name}</h1>
              <h6>Email</h6>
              <h1>{email}</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Courses;