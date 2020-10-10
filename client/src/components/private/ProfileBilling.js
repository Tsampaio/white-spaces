import React, { useEffect, Fragment, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCoursesOwned } from '../../actions/courses';
import { checkMembership, cancelMembership, membershipResubscribe } from '../../actions/membership';
import store from '../../store';
import ProfileSidebar from './ProfileSidebar';
import './Profile.css';

function ProfileBilling({ auth, active, checkMembership, cancelMembership, membershipResubscribe }) {
  const [cropState, setCropState] = useState({
    src: null,
    crop: {
      aspect: 1 / 1
    }
  });

  const [page, setPage] = useState({
    loaded: false
  });

  useEffect(() => {
    loaderDelay();
  }, []);

  const loaderDelay = () => {
    setTimeout(() => {
      setPage({ loaded: true })
    }, 500);
  }

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCoursesOwned(auth && auth.user && auth.user._id));
    // console.log(auth.user.name);
    console.log("before check membership ");
    if (auth && auth.user && auth.user.membership && auth.user.membership.customerId) {
      checkMembership(auth.token);
    }

    // console.log(auth);
  }, [auth && auth.user && auth.user._id]);

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
    userPic = <img src={img} className="userAvatar" />
  } else {
    img = images(`./default.png`);
    userPic = <img src={img} className="userAvatar" />
  }

  // const verifyFile = (files) => {
  //   if (files && files.length > 0) {
  //     const currentFile = files[0]
  //     const currentFileType = currentFile.type
  //     const currentFileSize = currentFile.size
  //     if (currentFileSize > imageMaxSize) {
  //       alert("This file is not allowed. " + currentFileSize + " bytes is too large")
  //       return false
  //     }
  //     if (!acceptedFileTypesArray.includes(currentFileType)) {
  //       alert("This file is not allowed. Only images are allowed.")
  //       return false
  //     }
  //     return true
  //   }
  // }

  // const handleOnDrop = (files, rejectedFiles) => {
  //   if (rejectedFiles && rejectedFiles.length > 0) {
  //     verifyFile(rejectedFiles)
  //   }

  //   if (files && files.length > 0) {
  //     const isVerified = this.verifyFile(files)
  //     if (isVerified) {
  //       // imageBase64Data 
  //       const currentFile = files[0]
  //       const myFileItemReader = new FileReader()
  //       myFileItemReader.addEventListener("load", () => {
  //         // console.log(myFileItemReader.result)
  //         const myResult = myFileItemReader.result;
  //         setCropState({
  //           ...cropState,
  //           imgSrc: myResult,
  //           imgSrcExt: extractImageFileExtensionFromBase64(myResult)
  //         })
  //       }, false)
  //       myFileItemReader.readAsDataURL(currentFile)
  //     }
  //   }
  // }

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setCropState({
          ...cropState,
          src: reader.result
        })
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

    // return new Promise((resolve, reject) => {
    //   canvas.toBlob(blob => {
    //     blob.name = fileName;
    //     resolve(blob);
    //   }, 'image/jpeg', 1);
    // });

    const reader = new FileReader()
    canvas.toBlob(blob => {
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        dataURLtoFile(reader.result, `${auth.user._id}.jpg`);
      }
    })

    // return new Promise((resolve, reject) => {
    //   canvas.toBlob(blob => {
    //     if (!blob) {
    //       //reject(new Error('Canvas is empty'));
    //       console.error('Canvas is empty');
    //       return;
    //     }
    //     blob.name = fileName;
    //     window.URL.revokeObjectURL(this.fileUrl);
    //     this.fileUrl = window.URL.createObjectURL(blob);
    //     resolve(this.fileUrl);
    //   }, 'image/jpeg');
    // });
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

  console.log(cropState.croppedImageUrl);

  return (
    <Fragment>
      <SecondHeader />
      <div className="profileCtn">
        <div className="container-fluid">
          <div className="row">
            <ProfileSidebar />
            <div className="col-lg-10 billingCtn">
              <div className="card">
                <div class="card-header">
                  Membership Details
                      </div>
                <div class="card-body">
                  {auth && auth.membership.active && (
                    <>

                      <h3><b>Membership Status:</b> {auth && auth.membership.status}</h3>
                      <h3><b>Membership Valid Until:</b> {auth && auth.membership.paidThroughDate}</h3>
                    </>
                  )}
                  {auth && auth.membership.status === "Active" && (
                    <button onClick={() => cancelMembership(auth && auth.token)}>Cancel Membership</button>
                  )}
                  {auth && auth.membership.status === "Canceled" && auth && auth.user &&
                    auth.user.membership && auth.user.membership.billingHistory && auth.user.membership.billingHistory.length > 0 && (
                      <button onClick={() => membershipResubscribe(auth && auth.token)} className="actionButton">Resubscribe</button>
                    )}
                  {auth && auth.membership && auth.membership.status === "Failed" && (
                    <Link to="/membership">Add a new payment method</Link>
                  )}
                </div>
              </div>
              
              <h2><b>Billing History</b></h2>
              <div className="row userBillingHistoryTitle">
                <div className="col-2"><h4>Date</h4></div>
                <div className="col-3"><h4>Product</h4></div>
                <div className="col-3"><h4>Period</h4></div>
                <div className="col-2"><h4>Coupon</h4></div>
                <div className="col-2"><h4>Sale Price</h4></div>
                
              </div>
              <hr/>


            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

ProfileBilling.propTypes = {
  // getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
  // profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  active: state.auth.active
});

export default connect(mapStateToProps, { checkMembership, cancelMembership, membershipResubscribe })(ProfileBilling);
