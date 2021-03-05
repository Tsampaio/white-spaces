import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { saveUsersAction, deleteUsersAction } from '../../actions/admin';
import { getCouponsAction } from '../../actions/admin';
// import ModalWindow from '../utils/ModalWindow';
import { Link } from 'react-router-dom';
import { Form, Col, Table, Button, Modal } from 'react-bootstrap';
import './AllUsers.css';
import './Coupons.css'

const Coupon = () => {

  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

  const admin = useSelector(state => state.admin);
  const { users, loading, coupons } = admin;

  const [stateUsers, setStateUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    action: "",
    users: [],
  });

  const [orderState, setOrderState] = useState({
    orderName: "",
    asc: false
  });

  const [pageUsers, setPageUsers] = useState({
    usersPerPage: 3,
    values: [],
    number: 1,
    firstPage: 0,
    lastPage: 1
  });

  const removeAdminFromUsers = users.filter(user => {
    return user.role !== "admin";
  })

  useEffect(() => {
    dispatch(allUsersAction());
    dispatch(getCouponsAction());
  }, []);

  useEffect(() => {
    if (!loading) {
      setStateUsers(removeAdminFromUsers);
    }
  }, [loading]);

  useEffect(() => {
    // console.log(stateUsers);
    const findSelected = stateUsers.find(user => {
      // console.log(user);
      return user.selected
    });
    // console.log(findSelected);

    setUserSelected(Boolean(findSelected));

    setPageUsers({
      ...pageUsers,
      values: paginate(stateUsers, pageUsers.usersPerPage, 1),
      number: 1,
      firstPage: 0,
      // lastPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number + 1).length
      lastPage: 1
    });
  }, [stateUsers]);


  function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  const selectUsers = (usersSelected, event) => {
    // console.log(stateUsers);
    console.log(event.target.type)
    if (usersSelected === "all") {
      const selectAllUsers = stateUsers.map((user, i) => {
        // if () {
        // console.log(user);
        // console.log(selectAll)
        return {
          ...user,
          selected: !selectAll,
          key: i
        }
        // }
      });

      const filteredUsers = selectAllUsers.filter(user => {
        return user.role != "admin";
      });

      console.log(filteredUsers)
      setStateUsers(filteredUsers);
      setSelectAll(!selectAll);
    } else {
      const selectAllCopy = [...stateUsers];
      // selectAllCopy[usersSelected].selected = !selectAllCopy[usersSelected].selected;
      selectAllCopy[usersSelected].selected = event.target.checked;

      setStateUsers(selectAllCopy);
    }

  }

  const allUsers = pageUsers.values.map((user, i) => {
    if (user.role !== "admin") {
      const today = new Date();
      const joinedDate = new Date(user.joined);
      const newJoinedDate = `${('0' + joinedDate.getDate()).slice(-2)}/${('0' + joinedDate.getMonth() + 1).slice(-2)}/${joinedDate.getFullYear()}`;
      // console.log("Inside all Users");
      // console.log(user.selected)
      const lastLogin = new Date(user.lastLogin);
      const lastLoginDate = () => {
        if (today.getDate() === lastLogin.getDate() &&
          today.getMonth() === lastLogin.getMonth() &&
          today.getFullYear() === lastLogin.getFullYear()
        ) {
          return `${('0' + lastLogin.getHours()).slice(-2)}:${('0' + lastLogin.getMinutes()).slice(-2)} - Today`
        } else {
          return `${('0' + lastLogin.getHours()).slice(-2)}:${('0' + lastLogin.getMinutes()).slice(-2)} - ${lastLogin.getDate()}/${lastLogin.getMonth() + 1}/${lastLogin.getFullYear()}`;
        }
      }
      return (
        <tr key={user._id}>
          <td>
            <input
              type="checkbox"
              checked={user.selected == null ? false : user.selected}
              value={user.selected}
              onChange={(e) => { selectUsers(i, e) }}
            />
            <div className="allUsersTableDiv"><Link to={`/admin/user/${user._id}`}>{user.name}</Link></div>
          </td>
          <td>
            <div className="allUsersTableDiv">{user.email}</div>
          </td>
          <td>
            <div className="allUsersTableDiv">{user.active}</div>
          </td>
          <td>
            <div className="allUsersTableDiv">${user.purchases} USD</div>
          </td>
          <td>
            <div className="allUsersTableDiv">{newJoinedDate}</div>
          </td>
          <td>
            <div className="allUsersTableDiv">{lastLoginDate()}</div>
          </td>
        </tr>
      )
    }
  })

  const orderBy = (order) => {
    console.log("ordering by date");
    removeAdminFromUsers.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      if (order === "date") {
        if (orderState.orderName === "date" && orderState.asc) {
          return new Date(a.joined) - new Date(b.joined);
        } else {
          return new Date(b.joined) - new Date(a.joined);
        }
      } else if (order === "purchases") {
        if (orderState.orderName === "purchases" && orderState.asc) {
          return a.purchases - b.purchases;
        } else {
          return b.purchases - a.purchases;
        }
      } else if (order === "email") {
        if (orderState.orderName === "email" && orderState.asc) {
          if (a.email > b.email) { return -1; }
          if (a.email < b.email) { return 1; }
        } else {
          if (a.email < b.email) { return -1; }
          if (a.email > b.email) { return 1; }
        }
        return 0;
      } else if (order === "name") {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        if (orderState.orderName === "name" && orderState.asc) {
          if (nameA > nameB) { return -1; }
          if (nameA < nameB) { return 1; }
        } else {
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
        }

        return 0;
      } else if (order === "active") {
        let activeA = a.active.toLowerCase();
        let activeB = b.active.toLowerCase();

        if (orderState.orderName === "active" && orderState.asc) {
          if (activeA < activeB) { return -1; }
          if (activeA > activeB) { return 1; }
        } else {
          if (activeA > activeB) { return -1; }
          if (activeA < activeB) { return 1; }
        }
        return 0;
      } else if (order === "lastLogin") {
        if (orderState.lastLogin === "date" && orderState.asc) {
          return new Date(a.lastLogin) - new Date(b.lastLogin);
        } else {
          return new Date(b.lastLogin) - new Date(a.lastLogin);
        }
      }

    });

    setStateUsers(removeAdminFromUsers);
    // setTest({ loading: false })
    setOrderState({
      orderName: order,
      asc: !orderState.asc
    })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    console.log(e.target.value);

    const selectedUsers = stateUsers.filter((user) => {
      return user.selected
    });

    console.log(selectedUsers)

    if (selectedUsers.length > 0) {
      let title = "";
      // let users = selectedUsers.map(user => {
      //   return user._id;
      // })
      if (e.target.value === "activate") {
        title = "Activate Users"
      } else if (e.target.value === "delete") {
        title = "Delete Users"
      }

      setModalText({
        title: title,
        action: e.target.value,
        users: selectedUsers
      });
      handleShow();
    }
  }

  const saveChanges = () => {
    console.log("inside save changes");
    if (modalText.action === "activate") {
      dispatch(saveUsersAction(modalText));
    } else if (modalText.action === "delete") {
      dispatch(deleteUsersAction(modalText));
    }
    setShow(false);
  }

  const movePage = (direction) => {
    if (direction === "previous") {
      setPageUsers({
        ...pageUsers,
        values: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number - 1),
        number: pageUsers.number - 1,
        firstPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number - 2).length,
        lastPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number).length
      })
    } else {
      console.log(pageUsers.number);
      console.log(paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number).length);
      setPageUsers({
        ...pageUsers,
        values: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number + 1),
        number: pageUsers.number + 1,
        firstPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number).length,
        lastPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number + 2).length
      })
    }
  }

  const findUser = (e) => {
    console.log("find a user");
    // console.log(e.target.value);
    const text = e.target.value.toLowerCase();
    console.log(text);
    const filteredusers = removeAdminFromUsers.filter((user) => {
      console.log(user.name)
      return (user.name.toLowerCase().indexOf(text) > -1 || user.email.toLowerCase().indexOf(text) > -1);
    })

    console.log(filteredusers);
    setStateUsers(filteredusers);
  }

  const allCoupons = coupons.map((coupon, i) => {

    const today = new Date();
    const couponDate = new Date(coupon.date);
    const newCouponDate = `${('0' + couponDate.getDate()).slice(-2)}/${('0' + couponDate.getMonth() + 1).slice(-2)}/${couponDate.getFullYear()}`;
    // console.log("Inside all Users");
    // console.log(user.selected)
    let emails = [];
    let courses = [];

    if (coupon.restricted.length > 0) {
      for (let i = 0; i < coupon.restricted.length; i++) {
        emails.push(coupon.restricted[i].email);
      }
    }

    const allEmails = emails.length > 0 && emails.map((email, i) => {
      return (
        <>
          <span>{email}</span>
          { i === (emails.length-1) ? "" : <hr className="my-2" />}
        </>
      )
    });

    for (let i = 0; i < coupon.courses.length; i++) {
      courses.push(coupon.courses[i].name);
    }

    const allCourses = courses.length > 0 && courses.map((course, i) => {
      return (
        <>
          <span key={i}>{course}</span>
          { i === (courses.length-1) ? "" : <hr className="my-2" />}
        </>
      )
    });

    const lastLogin = new Date(coupon.lastLogin);
    const lastLoginDate = () => {
      if (today.getDate() === lastLogin.getDate() &&
        today.getMonth() === lastLogin.getMonth() &&
        today.getFullYear() === lastLogin.getFullYear()
      ) {
        return `${('0' + lastLogin.getHours()).slice(-2)}:${('0' + lastLogin.getMinutes()).slice(-2)} - Today`
      } else {
        return `${('0' + lastLogin.getHours()).slice(-2)}:${('0' + lastLogin.getMinutes()).slice(-2)} - ${lastLogin.getDate()}/${lastLogin.getMonth() + 1}/${lastLogin.getFullYear()}`;
      }
    }
    return (
      <tr key={coupon._id}>
        <td>
          <div>
          <input
            type="checkbox"
            checked={coupon.selected == null ? false : coupon.selected}
            value={coupon.selected}
            onChange={(e) => { selectUsers(i, e) }}
            className="mr-2"
          />
          <div className="allUsersTableDiv"><Link to={`/admin/coupons/edit/${coupon._id}`}>{coupon.code}</Link></div>
          </div>
        </td>
        <td className="px-3">
          <div className="allUsersTableDiv">{coupon.name}</div>
        </td>
        <td className="px-3">
          <div className="allUsersTableDiv">{newCouponDate}</div>
        </td>
        <td className="px-3">
          <div className="allUsersTableDiv">{coupon.used}</div>
        </td>
        <td className="px-3">
          <div className="allUsersTableDiv">{coupon.available}</div>
        </td>
        <td className="px-3">{allCourses}</td>
        <td className="px-3">{allEmails.length > 0 ? allEmails : "No Restrictions"}</td>
        <td className="px-3">{coupon.active ? "True" : "False" }</td>
      </tr>
    )

  })

  return (
    <div className="allUsersCtn container-fluid">
      <div className="row">
        <div className="col allCouponsTable">
          <Link to="/admin/coupons/new" className="btn btn-primary">New Coupon</Link>
          <div className="row">
            <Col sm="5">
              <Form.Control className="my-3 input-md" type="text" placeholder="Search coupons" onChange={findUser} />
            </Col>
          </div>
          <Table striped bordered hover responsive size="sm">
            <thead className="thead-dark">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => { selectUsers("all", e) }}
                    className="mr-2"
                  />
                  {userSelected ? (
                    <select defaultValue={'DEFAULT'} onChange={handleChange}>
                      <option value="DEFAULT" disabled>Bulk Actions</option>
                      <option value="activate">Activate</option>
                      <option value="delete">Delete</option>
                    </select>
                  ) : (
                      <span onClick={() => orderBy("name")}>Codes</span>
                    )}
                </th>
                <th className="px-3" onClick={() => orderBy("email")}>Name</th>
                <th className="px-3" onClick={() => orderBy("active")}>Expires</th>
                <th className="px-3" onClick={() => orderBy("purchases")}>Used</th>
                <th className="px-3" onClick={() => orderBy("date")}>Available</th>
                <th className="px-3" onClick={() => orderBy("lastLogin")}>Courses</th>
                <th className="px-3" onClick={() => orderBy("lastLogin")}>Emails</th>
                <th className="px-3" onClick={() => orderBy("lastLogin")}>Active</th>
              </tr>
            </thead>
            <tbody>
              {allCoupons.length > 0 ? allCoupons : <tr className="my-3"><td>No Users found</td></tr>}
            </tbody>
            {/* <h1>{!test.loading ? "Working" : null}</h1> */}
          </Table>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={pageUsers.firstPage < 1 ? "disabled page-item" : "page-item"}>
                <Button onClick={() => movePage("previous")} className="page-link" href="#">Previous</Button>
              </li>
              <li className={pageUsers.lastPage < 1 ? "disabled page-item" : "page-item"}>
                <Button onClick={() => movePage("next")}
                  className="page-link"
                  href="#">Next</Button>
              </li>
            </ul>
          </nav>

        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {modalText.action} the following users?</p>
          {modalText.users.map((user, i) => {
            return <p key={i}><b>{user.name}</b></p>;
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Coupon
