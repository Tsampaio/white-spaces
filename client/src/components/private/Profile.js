import React, { useEffect, Fragment, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import SecondHeader from '../partials/SecondHeader';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourses } from '../../actions/courses';
import store from '../../store';
import Avatar from '../../images/avatar.png';
import './Profile.css';

// import {
//   base64StringtoFile,
//   downloadBase64File,
//   extractImageFileExtensionFromBase64,
//   image64toCanvasRef
// } from '../utils/imageUtils';
// import e from 'express';

function Profile({ auth, active, courses }) {
  const [cropState, setCropState] = useState({
    src: null,
    crop: {
      aspect: 1 / 1
    }
  });

  useEffect(() => {
    //     console.log(auth);
    // console.log(active == 'notActive');
    // console.log(!auth.loading)

    store.dispatch(getCourses(auth && auth.user && auth.user.courses));
    // console.log(auth.user.name);

    // console.log(auth);
  }, [auth]);

  const imageMaxSize = 1000000000 // bytes
  const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
  const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });
  //let imageRef = null;
  let imageRef = useRef();


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
        dataURLtoFile(reader.result, 'cropped.jpg')
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

      const res = await axios.post("/api/users/profilePic", formData, config);
      console.log("res.data");
      console.log(res.data);
  }
  

  if (active == 'notActive' && !auth.loading) {
    console.log("inside redirect");
    return <Redirect to="/activate" />
  }


  console.log(cropState);
  return (
    <Fragment>
      <SecondHeader />
      <div className="profileCtn">
        <div className="container">
          <div className="row">
            <div className="col-4 userLeftCol">
              <img className="userAvatar" src={Avatar} alt="user avatar" />
              <h1>{auth && auth.user && auth.user.name}</h1>

            </div>
            <div className="col-8 userRightCol">
              {/* <input ref={fileInputRef} type='file' accept={acceptedFileTypes} multiple={false} onChange={handleFileSelect} /> */}
              <div>
                <input type="file" accept="image/*" onChange={onSelectFile} />
              </div>
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
              <form onSubmit={handleSubmit}>
                <button type="submit">Save</button>
              </form>


              <h1>About Me</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam voluptas asperiores omnis? Expedita corrupti, beatae reiciendis possimus ratione autem quos dignissimos provident a ea, veniam hic doloribus, odit atque quia!</p>
              <h1>My Courses</h1>
              <div className="myCoursesCtn">
                {courses && courses.all && courses.all.map((course, i) => {
                  return <h1 key={i}>{course.name}</h1>
                })
                }
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
  active: state.auth.active,
  courses: state.courses
});

export default connect(mapStateToProps)(Profile);
