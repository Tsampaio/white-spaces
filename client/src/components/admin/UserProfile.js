import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../../actions/auth';
import { getCourses } from '../../actions/courses';
import { getUserPurchases } from '../../actions/admin';
import { enrollUserInCourse } from '../../actions/admin';
// import './Courses.css'
import './UserProfile.css'

const Courses = ({ match, history }) => {
  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin);
  const { userPurchases } = admin;
  const { _id, name, email, joined, active, purchases, courses } = admin.userDetails;
  // console.log(_id)
  const { subPage } = useParams();
  // console.log(subPage);

  const gettingCourses = useSelector(state => state.courses);
  const { all } = gettingCourses;

  const [courseSelected, setCourseSelected] = useState({
    id: "",
    name: ""
  });
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    action: "",
    users: [],
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [userCourses, setUserCourses] = useState([]);
  const [userCoursesDetails, setUserCoursesDetails] = useState([]);

  useEffect(() => {
    dispatch(getUserDetails(subPage));
    dispatch(getUserPurchases(subPage));
    dispatch(getCourses());
  }, []);

  useEffect(() => {
    setUserCourses(courses);
    
  }, [courses]);

  useEffect(() => {
    theUserCoursesFunc();
  }, [userCourses])

  const images = require.context('../../images/', true);
  let img;
  try {
    img = images(`./${subPage}.jpg`);
  } catch (error) {
    img = images(`./default.png`);
  }

  const date = new Date(joined);
  const userJoined = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const allPurchases = userPurchases.map((purchase, i) => {
    const date = new Date(purchase.date);
    const newDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
      <tr key={i}>
        <td>{newDate}</td>
        <td>{purchase.price}</td>
        <td>None</td>
        <td>{purchase.price}</td>
        <td>{purchase.productName}</td>
      </tr>
    )
  });

  const allCourses = all.map((course, i) => {
    return <option value={`${course._id},${course.name}`}>{course.name}</option>
  });

  const handleChange = (e) => {
    const valueSplit = e.target.value.split(",")
    setCourseSelected({
      id: valueSplit[0],
      name: valueSplit[1]
    });
    handleShow();
  }

  const enrollUser = () => {
    dispatch(enrollUserInCourse(courseSelected.id, _id));
    setShow(false);
  }

  // const saveChanges = () => {
  // console.log("inside save changes");
  // if (modalText.action === "activate") {
  //   dispatch(saveUsersAction(modalText));
  // } else if (modalText.action === "delete") {
  //   dispatch(deleteUsersAction(modalText));
  // }
  // setShow(false);
  // }

  // const theUserCourses = userCourses && userCourses.filter(courseId => {
  //   for(let i=0; i < all.length; i++ ) {
  //     return all[i]._id == courseId
  //   }
  // });

  const theUserCoursesFunc = () => {
    let courses = [];
    if (userCourses && userCourses.length > 0) {
      for (let i = 0; i < all.length; i++) {
        for (let j = 0; j < userCourses.length; j++) {
          if (all[i]._id == userCourses[j]) {
            courses = [...courses, all[i]]
          }
        }
      }
    }

    // return courses;
    setUserCoursesDetails(courses);
  }

  const displayUserCourses = userCoursesDetails.map(course => {
    return <h4>{course.name}</h4>
  })

  console.log(userCoursesDetails);
  console.log(displayUserCourses);
  return (
    <>
      <div className="adminCtn col-xl-10">
        <div className="row">
          <div className="col-2">
            <img className="userAvatar" src={img.default} style={{ width: "100%" }} />
          </div>
          <div className="col-10">
            <div className="card userCard">
              <div className="userColDivider">
                <h6>Name</h6>
                <h4>{name}</h4>
              </div>
              <div className="userColDivider">
                <h6>Email</h6>
                <h4>{email}</h4>
              </div>
              <div className="userColDivider">
                <h6>Profile Status</h6>
                <h4>{active}</h4>
              </div>
              <div className="userColDivider">
                <h6>Account Created</h6>
                <h4>{userJoined}</h4>
              </div>
              <div className="userColDivider">
                <h6>Last Login</h6>
                <h4>Today</h4>
              </div>
              <div className="userColDivider">
                <h6>Total Purchases</h6>
                <h4>${purchases} USD</h4>
              </div>
            </div>

          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h4>Purchase History</h4>
          </div>
          <div className="col-10">
            <table>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>FULL PRICE</th>
                  <th>DISCOUNTS</th>
                  <th>SALE PRICE</th>
                  <th>PRODUCT</th>
                </tr>
              </thead>
              <tbody>
                {allPurchases.reverse()}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h4>User Courses</h4>
          </div>
          <div className="col-10">
            <div className="card userCard">
              {displayUserCourses}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h4>Enroll In Course</h4>
            <p>Manually enroll this user in a new course. Users are not charged for manual enrollments.</p>
          </div>
          <div className="col-10">
            <div className="card userCard">

              <select defaultValue={'DEFAULT'} onChange={handleChange}>
                <option value="DEFAULT" disabled>Select course</option>
                {allCourses}
              </select>
              <button onClick={enrollUser}>Enroll</button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enroll user in course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to enroll <b>{name}</b> in the following course?</p>

          <p><b>{courseSelected.name}</b></p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={enrollUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Courses;