import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { saveUsersAction, deleteUsersAction } from '../../actions/admin';
// import ModalWindow from '../utils/ModalWindow';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AllUsers.css'

const AllUsers = () => {

  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { token } = auth;

  const admin = useSelector(state => state.admin);
  const { users, loading } = admin;
  // const courses = useSelector(state => state.courses);

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
  })

  useEffect(() => {
    dispatch(allUsersAction());
  }, []);

  useEffect(() => {
    if (!loading) {
      setStateUsers(users);
    }
  }, [loading]);

  useEffect(() => {
    console.log(stateUsers);
    const findSelected = stateUsers.find(user => {
      console.log(user);
      return user.selected
    });
    console.log(findSelected);

    setUserSelected(Boolean(findSelected));
  }, [stateUsers])

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
      selectAllCopy[usersSelected].selected =  event.target.checked;

      setStateUsers(selectAllCopy);
    }

  }

  const allUsers = stateUsers.map((user, i) => {
    if (user.role !== "admin") {
      const joinedDate = new Date(user.joined);
      const newJoinedDate = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;
      console.log("Inside all Users");
      console.log(user.selected)
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
        </tr>
      )
    }
  })

  const orderBy = (order) => {
    console.log("ordering by date");
    users.sort(function (a, b) {
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
      }

    });

    setStateUsers(users);
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

  // console.log(selectAll);
  // console.log(modalText);
  // console.log(stateUsers)
  return (
    <div className="allUsersCtn container">
      <div className="row">
        <div className="col allUsersTable">
          <h5 className="mb-5">Showing 1 - 25 of {stateUsers.length} Students</h5>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {selectUsers("all", e)}}
                  />
                  {userSelected ? (
                    <select defaultValue={'DEFAULT'} onChange={handleChange}>
                      <option value="DEFAULT" disabled>Bulk Actions</option>
                      <option value="activate">Activate</option>
                      <option value="delete">Delete</option>
                    </select>
                  ) : (
                      <span onClick={() => orderBy("name")}>Name</span>
                    )}
                </th>
                <th onClick={() => orderBy("email")}>Email</th>
                <th onClick={() => orderBy("active")}>Active</th>
                <th onClick={() => orderBy("purchases")}>Purchases</th>
                <th onClick={() => orderBy("date")}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {allUsers}
            </tbody>
            {/* <h1>{!test.loading ? "Working" : null}</h1> */}
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {modalText.action} the following users?</p>
          {modalText.users.map(user => {
            return <p><b>{user.name}</b></p>;
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

export default AllUsers
