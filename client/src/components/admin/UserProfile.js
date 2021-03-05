import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, withRouter  } from 'react-router-dom';
import { getUserDetails } from '../../actions/auth';
import { getCourses } from '../../actions/courses';
import { enrollUserInCourse, removeCourseAction, getUserPurchases, deleteUsersAction } from '../../actions/admin';
// import './Courses.css'
import './UserProfile.css'

const Courses = ({ match, history }) => {
  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin);
  const { userPurchases } = admin;
  const { _id, name, email, joined, active, purchases, courses, lastLogin } = admin.userDetails;
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
    body: "",
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
    // theUserCoursesFunc();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUserCourses(courses);
  }, [courses]);

  useEffect(() => {
    theUserCoursesFunc();
  }, [userCourses, all])

  // const images = require.context('../../images/', true);
  const images = require.context('../../../../uploads/users/', true);
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
    const products = purchase.productName.map((product, i) => {
      console.log(product)
      return <><span>{product}</span>{purchase.productName.length - 1 !== i ? <hr /> : ""}</>
    })

    return (
      <tr key={i}>
        <td>{newDate}</td>
        <td>{purchase.price}</td>
        <td>None</td>
        <td>{purchase.price}</td>
        <td>{products}</td>
      </tr>
    )
  });

  const allCourses = all.map((course, i) => {
    return <option key={i} value={`${course._id},${course.name}`}>{course.name}</option>
  });

  const handleChange = (e) => {
    const valueSplit = e.target.value.split(",")
    setCourseSelected({
      id: valueSplit[0],
      name: valueSplit[1]
    });
    setModalText({
      ...modalText,
      title: "Enroll user in course",
      body: `Are you sure you want to enrol <b>${name}</b> in the following course?`,
      action: "adding"
    });

    handleShow();
  }

  const modalAction = () => {
    if (modalText.action === "adding") {
      dispatch(enrollUserInCourse(courseSelected.id, _id));
    } else if (modalText.action === "removing") {
      dispatch(removeCourseAction(courseSelected.id, _id));
    } else if(modalText.action === "deleteUser" ) {
      dispatch(deleteUsersAction(modalText));
      history.push("/admin/users");
    }
    setShow(false);
  }

  const theUserCoursesFunc = () => {
    console.log("calling theUserCoursesFunc");
    console.log(userCourses);
    console.log(all);
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
    console.log("THE COURSES ARE");
    console.log(courses);
    setUserCoursesDetails(courses);
  }

  const removeCourse = (courseId, courseName) => {
    // dispatch(removeCourseAction(courseId, userId));
    setCourseSelected({
      id: courseId,
      name: courseName
    });
    setModalText({
      ...modalText,
      title: "Delete course from user",
      body: "Are you sure you want to delete the course " + courseName + "?",
      action: "removing"
    });
    handleShow();
  }

  const displayUserCourses = userCoursesDetails.map((course, i) => {
    return (
      <tr key={i}>
        <td>{course.name}</td>
        <td onClick={() => removeCourse(course._id, course.name)}><i className="fas fa-trash-alt"></i></td>
      </tr>
    )
  });

  const deleteUser = () => {
    setModalText({
      title: "Delete user",
      action: "deleteUser",
      body: "Are you sure you want to delete the user " + name,
      users: [admin.userDetails]
    });
    handleShow();
  }

  const userLastLogin = new Date(lastLogin);
  const userLastLoginDate = `${userLastLogin.getDate()}/${userLastLogin.getMonth() + 1}/${userLastLogin.getFullYear()}`;

  console.log(userCoursesDetails);
  console.log(userCourses);
  return (
    <>
      <div className="adminCtn col-xl-10">
        <div className="row">
          <div className="col-2">
            <img className="userAvatar" src={img.default} style={{ width: "100%" }} alt="user avatar" />
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
                <h4>{userLastLoginDate}</h4>
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
              <table>
                <tbody>
                  {displayUserCourses}
                </tbody>
              </table>
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
              {/* <button onClick={enrollUser}>Enroll</button> */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="offset-md-2 col-10">
            <button onClick={deleteUser} className="btn btn-danger">Delete User</button>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalText.body}</p>

          <p><b>{courseSelected.name}</b></p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={modalAction}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default withRouter(Courses);