import React, { useEffect, Fragment, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { updateUserAction } from '../../actions/auth';
import { checkMembership, cancelMembership, membershipResubscribe } from '../../actions/membership';
import store from '../../store';
import './Profile.css';
import ProfileSidebar from './ProfileSidebar';

// import {
//   base64StringtoFile,
//   downloadBase64File,
//   extractImageFileExtensionFromBase64,
//   image64toCanvasRef
// } from '../utils/imageUtils';
// import e from 'express';

function Profile({ auth, active, checkMembership, updateUserAction, cancelMembership, membershipResubscribe }) {
  const [cropState, setCropState] = useState({
    src: null,
    crop: {
      aspect: 1 / 1
    }
  });

  const [page, setPage] = useState({
    loaded: false,
    showImagePreview: false
  });

  const [userDetails, setUserDetails] = useState({
    name: '',
    newPassword: '',
    newPasswordConfirm: '',
    password: '',
    error: ''
  })

  useEffect(() => {
    // loaderDelay();
  }, []);

  const loaderDelay = () => {
    setTimeout(() => {
      setPage({ ...page, loaded: true })
    }, 500);
  }

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    console.log("before check membership ");
    if( auth && auth.user && auth.user.membership && auth.user.membership.customerId ) {
      checkMembership(auth.token);
    }

    setUserDetails({
      ...userDetails,
      name: auth && auth.user && auth.user.name
    })

    // console.log(auth);
  }, [auth && auth.user && auth.user._id]);

  const updateUserDetails = (event) => {
    setUserDetails({
      ...userDetails,
      [event.target.name]: event.target.value 
    })
  }

  const submitUserDetails = (event) => {
    event.preventDefault();
    if(userDetails.newPassword !== userDetails.newPasswordConfirm) {
      setUserDetails({
        ...userDetails,
        error: "Passwords do not match"
      })
    }

    updateUserAction(auth && auth.token, userDetails);
  }

  const imageMaxSize = 1000000000 // bytes
  const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
  const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });
  //let imageRef = null;
  let imageRef = useRef();

  let userPic = null;
  const images = require.context('../../images/', true);

  let img;

  if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
    // import Pic from `/${auth.user._id}.jpg`;
    // userPic = <img src={`/${auth.user._id}.jpg`} />
    img = images(`./${auth.user._id}.jpg`);
    userPic = <img src={img} className="userAvatar" onLoad={() => setPage({loaded: true})} />
  } else {
    img = images(`./default.png`);
    userPic = <img src={img} className="userAvatar" onLoad={() => setPage({loaded: true})} />
  }

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
          
          setCropState({
            ...cropState,
            src: reader.result
          })
          setPage({ ...page, showImagePreview: true })
        }
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = async image => {
    console.log(image);
    imageRef.current = image;

  };

  const onCropComplete = crop => {
    makeClientCrop(crop);
  };

  const onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    console.log("inside onCropChange");
    setCropState({
      ...cropState,
      crop
    });
  };

  const makeClientCrop = async (crop) => {
    console.log(imageRef.current);
    if (imageRef.current && crop.width && crop.height) {
      console.log(crop );
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        'newFile.jpeg'
      );
      console.log(croppedImageUrl);
      setCropState({
        ...cropState,
        croppedImageUrl: croppedImageUrl
      });
    }
  }

  const getCroppedImg = (image, crop, fileName) => {
    console.log(image);
    console.log(crop);
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const reader = new FileReader()
    canvas.toBlob(blob => {
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        dataURLtoFile(reader.result, `${auth.user._id}.jpg`);
      }
    })
  }

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    setCropState({
      ...cropState,
      croppedImage: croppedImage
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    const formData = new FormData();
    formData.append('file', cropState.croppedImage);
    formData.append('userId', auth.user._id);

    console.log(formData);

    const res = await axios.post("/api/users/profilePic", formData, config);
    console.log("res.data");
    console.log(res.data);
  }


  const coursesimage = require.context('../../images/courses', true);

  const allCourses = auth && auth.coursesOwned.map((course, index) => {
    let img = "";
    if (course && course.hasThumbnail) {
      img = coursesimage(`./${course.tag}.jpg`);
    } else {
      img = coursesimage(`./default-course.jpg`);
    }

    return (
      <div className="col-4" key={index}>
        <div className="cardBorder">
          <div className="courseThumbnail courseFeatured1">
            <Link to={`/courses/${course.tag}/lessons/1`}>
              <img src={img} alt="javascript" />
            </Link>
          </div>
          <div className="courseTitleCtn">
            <Link to={`/courses/${course.tag}/lessons/1`}>{course.name}</Link>
          </div>
          <div className="separator"></div>
          <div className="priceCtn">
            <span className="studentNumbers"><i className="fas fa-user"></i> Telmo Sampaio</span><span className="price">${course.price}</span>
          </div>
        </div>
      </div>
    )
  })


  if (active == 'notActive' && !auth.loading) {
    console.log("inside redirect");
    return <Redirect to="/activate" />
  }

  console.log(userDetails)

  return (
    <Fragment>
      <SecondHeader />
      <div className="profileCtn">
        <div className="container-fluid">
          <div className="row">
            <ProfileSidebar />
            <div className="col-xl-10 col-lg-9 col-md-8 userRightCol">
              <div className="userDetails">
                  {!page.loaded && (
                    <div className="preLoaderProfilePic">
                      <div className="spinner-border " role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  <div className="uploadButtonCtn">
                    <label htmlFor="file">{userPic}</label>
                    <input type="file" id="file" accept="image/*" onChange={onSelectFile} />
                  </div>
                  
                  { page.showImagePreview && (<div className="imagePreviewOverlay">
                    <h2>Crop your Image</h2>
                    {cropState.src && (
                      <ReactCrop
                        src={cropState.src}
                        crop={cropState.crop}
                        ruleOfThirds
                        onImageLoaded={onImageLoaded}
                        onComplete={onCropComplete}
                        onChange={onCropChange}
                      />
                    )}
                    {cropState.croppedImageUrl && (
                      <img alt="Crop" style={{ maxWidth: '100%' }} src={cropState.croppedImageUrl} />
                    )}
                    {cropState.src ? (
                      <form onSubmit={handleSubmit}>
                        <button type="submit" className="uploadButton">Save image</button>
                      </form>
                      ) : null
                    }
                  </div>)
                }
                
                <h3>Upload a new profile image</h3>
                <form onSubmit={submitUserDetails}>
                  <label htmlFor="">Full Name</label>
                  <input type="text" placeholder="My name" value={userDetails.name || ""} name="name" onChange={updateUserDetails}/>
                  <label htmlFor="">New Password</label>
                  <input type="password" name="newPassword" onChange={updateUserDetails}/>
                  <label htmlFor="">Confirm Password</label>
                  <input type="password" name="newPasswordConfirm" onChange={updateUserDetails}/>
                  
                  <hr />
                  <label htmlFor="">To save changes, enter current password</label>
                  <input type="password" name="password" onChange={updateUserDetails}/>
                  <p className="formError">{auth && auth.message}</p>
                  <button className="saveChanges" type="submit">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

Profile.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  active: state.auth.active
});

export default connect(mapStateToProps, { checkMembership, cancelMembership, membershipResubscribe, updateUserAction })(Profile);
