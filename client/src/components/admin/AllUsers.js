import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { saveUsersAction } from '../../actions/admin';
import ModalWindow from '../utils/ModalWindow';
import { Button, Modal } from 'react-bootstrap';
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
  
  const [test, setTest] = useState({
    loading: true
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
    const findSelected = stateUsers.find(user => {
      return user.selected
    });
    console.log(findSelected);

    setUserSelected(Boolean(findSelected));
  }, [stateUsers])

  const selectUsers = (usersSelected) => {
    if (usersSelected === "all") {
      const selectAllUsers = stateUsers.map((user) => {
        return {
          ...user,
          selected: !selectAll
        }
      })

      setStateUsers(selectAllUsers);
      setSelectAll(!selectAll);
    } else {
      const selectAllCopy = [...stateUsers];
      selectAllCopy[usersSelected].selected = !selectAllCopy[usersSelected].selected;

      setStateUsers(selectAllCopy);
    }

  }

  const allUsers = stateUsers.map((user, i) => {

    const joinedDate = new Date(user.joined);
    const newJoinedDate = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;
    console.log("Inside all Users");
    console.log(newJoinedDate)
    return (
      <tr key={user._id}>
        <td>
          <input
            type="checkbox"
            checked={user.selected}
            value={user.selected}
            onChange={() => selectUsers(i)}
          />
          <div className="allUsersTableDiv">{user.name}</div>
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
  })

  const orderBy = (order) => {
    console.log("ordering by date");
    users.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      if (order === "date") {
        return new Date(b.joined) - new Date(a.joined);
      } else if (order === "purchases") {
        return b.purchases - a.purchases;
      } else if (order === "email") {
        if (a.email < b.email) { return -1; }
        if (a.email > b.email) { return 1; }
        return 0;
      } else if (order === "name") {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        if (nameA < nameB) { return -1; }
        if (nameA > nameB) { return 1; }
        return 0;
      } else if (order === "active") {
        let activeA = a.active.toLowerCase();
        let activeB = b.active.toLowerCase();
        if (activeA < activeB) { return -1; }
        if (activeA > activeB) { return 1; }
        return 0;
      }

    });

    setStateUsers(users);
    setTest({ loading: false })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    console.log(e.target.value);

    const selectedUsers = stateUsers.filter((user) => {
      return user.selected
    });

    console.log(selectedUsers)

    if( selectedUsers.length > 0 ) {
      let title = "";
      // let users = selectedUsers.map(user => {
      //   return user._id;
      // })
      if( e.target.value === "activate" ) {
        title = "Activate Users"
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
    dispatch(saveUsersAction(modalText));
  }

  console.log(selectAll);
  console.log(modalText);
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
                    onChange={() => selectUsers("all")}
                  />
                  {userSelected ? (
                    <select onChange={handleChange}>
                      <option value="false" selected disabled hidden>Bulk Actions</option>
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
            <h1>{!test.loading ? "Working" : null}</h1>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {modalText.action} the following users?</p>
          { modalText.users.map(user => {
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
