import React, { useEffect, useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction } from '../../actions/auth';
import './Profile.css';

function Profile( ) {
  const [cropState, setCropState] = useState({
    src: null,
    crop: {
      aspect: 1,
      height: 297,
      unit: "px",
      width: 297,
      x: 0,
      y: 0
    }
  });

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { active } = auth;

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

  const [imageUpload, setImageUpload] = useState({
    error: ''
  })

  const loaderDelay = () => {
    setTimeout(() => {
      setPage({ ...page, loaded: true })
    }, 500);
  }

  useEffect(() => {
    console.log("before check membership ");

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
    if (userDetails.newPassword !== userDetails.newPasswordConfirm) {
      setUserDetails({
        ...userDetails,
        error: "Passwords do not match"
      })
    }

    dispatch(updateUserAction(auth && auth.token, userDetails));
  }

  const imageMaxSize = 2000000 // bytes
  const acceptedFileTypes = 'image/png, image/jpg, image/jpeg, image/gif';
  const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() });
  //let imageRef = null;
  let imageRef = useRef();
  let fileRef = useRef();

  let userPic = null;
  // const images = require.context('../../images/', true);
  const images = require.context('../../../../uploads/users/', true);

  let img;

  try {
    img = images(`./${auth.user._id}.jpg`);
    userPic = <img src={img.default} className="userAvatar" onLoad={() => setPage({ loaded: true })} alt="User Profile"/>
  } catch (error) {
    img = images(`./default.png`);
    userPic = <img src={img.default} className="userAvatar" onLoad={() => setPage({ loaded: true })} alt="User Profile"/>
  }
  // if (auth && auth.user && auth.user._id && auth.user.hasProfilePic) {
  //   // import Pic from `/${auth.user._id}.jpg`;
  //   // userPic = <img src={`/${auth.user._id}.jpg`} />
  //   img = images(`./${auth.user._id}.jpg`);
  //   userPic = <img src={img.default} className="userAvatar" onLoad={() => setPage({ loaded: true })} alt="User Profile"/>
  // } else {
  //   img = images(`./default.png`);
  //   userPic = <img src={img.default} className="userAvatar" onLoad={() => setPage({ loaded: true })} alt="User Profile"/>
  // }

  const onSelectFile = e => {

    if( e.target.files.length < 1) {
      setImageUpload({ error: 'No image selected' });
      return
    }
    console.log("INSIDE onSelectFile");
    console.log(e.target.files[0].size);
    console.log(e.target.files[0].type);
    console.log(acceptedFileTypesArray)

    if (e.target.files[0].size > imageMaxSize) {
      setImageUpload({ error: 'Image size should be less than 2 MB' });
      return
    } else if (!acceptedFileTypesArray.includes(e.target.files[0].type)) {
      setImageUpload({ error: 'Image should be of the type JPG, JPEG, PNG or GIF' });
      return
    }

    setPage({ ...page, showImagePreview: true })
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      console.log(reader.result);
      reader.addEventListener('load', () => {

        setCropState({
          ...cropState,
          src: reader.result
        })
        // setPage({ ...page, showImagePreview: true })
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
      console.log(crop);
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
    try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    console.log(cropState.croppedImage)
    const formData = new FormData();
    formData.append('file', cropState.croppedImage);
    // formData.append('userId', auth.user._id);

    console.log(formData);

    const res = await axios.post(`/api/users/profilePic`, formData, config);
    console.log("res.data");
    console.log(res.data);
    } catch(error) {
      const errors = error.response.data;
      console.log(error)
      setImageUpload({ error: 'Image size should be less than 2 MB' });
      // console.log("File Size is too large. Allowed file size is 100KB");
      closeImagePreview()
      console.log(errors.message);
    }
  }

  const closeImagePreview = () => {
    setPage({ ...page, showImagePreview: false })
    console.log(fileRef.current);
    fileRef.current.value = null;
    setCropState({
      ...cropState,
      crop: {
        aspect: 1 / 1
      }
    })
  }

  // if (active == 'notActive' && !auth.loading) {
  //   console.log("inside redirect");
  //   return <Redirect to="/activate" />
  // } else if (auth && !auth.isAuthenticated && !auth.loading) {
  //   return <Redirect to="/" />
  // }

  console.log(page);
  // console.log(cropState)

  return (

    <div className="col-xl-10 col-lg-9 col-md-12 col-sm-12 userRightCol">
      <div className="userDetails">
        {imageUpload.error &&
          <h1>{imageUpload.error}</h1>
        }
        {!page.loaded && (
          <div className="preLoaderProfilePic">
            <div className="spinner-border " role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <div className="uploadButtonCtn">
          <label htmlFor="file">{userPic}</label>
          <input ref={fileRef} type="file" id="file" accept="image/*" onChange={onSelectFile} />
        </div>

        {page.showImagePreview && (<div className="imagePreviewOverlay">
          <i className="fa fa-times-circle closeOverlay" onClick={closeImagePreview}></i>
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
          <input type="text" placeholder="My name" value={userDetails.name || ""} name="name" onChange={updateUserDetails} />
          <label htmlFor="">New Password</label>
          <input type="password" name="newPassword" onChange={updateUserDetails} />
          <label htmlFor="">Confirm Password</label>
          <input type="password" name="newPasswordConfirm" onChange={updateUserDetails} />

          <hr />
          <label htmlFor="">To save changes, enter current password</label>
          <input type="password" name="password" onChange={updateUserDetails} />
          <p className="formError">{auth && auth.message}</p>
          <button className="saveChanges" type="submit">Save Changes</button>
        </form>
      </div>
    </div>

  );
};

export default Profile;
