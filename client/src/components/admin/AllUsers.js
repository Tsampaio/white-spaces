import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { saveUsersAction, deleteUsersAction } from '../../actions/admin';
// import ModalWindow from '../utils/ModalWindow';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form, Col } from 'react-bootstrap';
import './AllUsers.css'

const AllUsers = () => {

  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin);
  const { users, loading } = admin;
  // const courses = useSelector(state => state.courses);

  const [stateUsers, setStateUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [show, setShow] = useState(false);
  const [changePages, setChangePages] = useState(true)
  const [orderByState, setOrderByState] = useState(false)
  
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
  }, []);

  useEffect(() => {
    if (!loading) {
      setStateUsers(removeAdminFromUsers);
    }
  }, [loading]);

  useEffect(() => {
    setStateUsers(removeAdminFromUsers);
    setChangePages(false)
    setOrderByState(true)
  }, [users])

  useEffect(() => {
    // console.log(stateUsers);
    
    const findSelected = stateUsers.find(user => {
      // console.log(user);
      return user.selected
    });
    console.log(findSelected);

    setUserSelected(Boolean(findSelected));
    
    console.log(paginate(stateUsers, pageUsers.usersPerPage, 1))

    if( changePages ) {
      setPageUsers({
        ...pageUsers,
        values: paginate(stateUsers, pageUsers.usersPerPage, 1),
        number: pageUsers.number,
        firstPage: pageUsers.firstPage,
        // lastPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number + 1).length
        lastPage: 1
      });
    } else if( orderByState ) {
      setPageUsers({
        ...pageUsers,
        values: paginate(stateUsers, pageUsers.usersPerPage, 1),
        number: 1,
        firstPage: 0,
        // lastPage: paginate(stateUsers, pageUsers.usersPerPage, pageUsers.number + 1).length
        lastPage: 1
      });
    }
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
        return user.role !== "admin";
      });

      console.log(filteredUsers)
      setChangePages(true);
      setOrderByState(false);

      setStateUsers(filteredUsers);
      setSelectAll(!selectAll);
    } else {
      const selectAllCopy = [...stateUsers];
      

      const globalUserSelected = (pageUsers.number-1) * pageUsers.usersPerPage + usersSelected;
      console.log("the user selected is:", usersSelected);
      console.log(selectAllCopy[globalUserSelected]);
      // selectAllCopy[usersSelected].selected = !selectAllCopy[usersSelected].selected;
      selectAllCopy[globalUserSelected].selected = event.target.checked;

      setChangePages(false);
      setOrderByState(false);
      setStateUsers(selectAllCopy);
    }

  }

  const allUsers = pageUsers.values.map((user, i) => {
    if (user.role !== "admin") {
      const today = new Date();
      const joinedDate = new Date(user.joined);
      const newJoinedDate = `${('0' + joinedDate.getDate()).slice(-2)}/${('0' + (joinedDate.getMonth() + 1)).slice(-2)}/${joinedDate.getFullYear()}`;
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
          return `${('0' + lastLogin.getHours()).slice(-2)}:${('0' + lastLogin.getMinutes()).slice(-2)} - ${lastLogin.getDate()}/${('0' + lastLogin.getMonth()).slice(-2)}/${lastLogin.getFullYear()}`;
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
      return 0;
    });

    setChangePages(false);
    setOrderByState(true);
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

    setChangePages(false);
    setOrderByState(true);

    console.log(filteredusers);
    setStateUsers(filteredusers);
  }

  console.log(pageUsers);
  console.log("Change page is: ", changePages)

  return (
    <div className="allUsersCtn container">
      <div className="row">
        <div className="col allUsersTable">
          <h5 className="mb-4">Showing 1 - 25 of {stateUsers.length} Students</h5>
          <div className="row">
            <Col sm="5">
              <Form.Control className="my-3 input-md" type="text" placeholder="Find a user" onChange={findUser} />
            </Col>
          </div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => { selectUsers("all", e) }}
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
                <th onClick={() => orderBy("lastLogin")}>Last login</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 ? allUsers : <h3 className="my-3">No Users found</h3>}
            </tbody>
            {/* <h1>{!test.loading ? "Working" : null}</h1> */}
          </table>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={pageUsers.firstPage < 1 ? "disabled page-item" : "page-item"}>
                <button onClick={() => movePage("previous")} className="page-link" href="#">Previous</button>
              </li>
              <li className={pageUsers.lastPage < 1 ? "disabled page-item" : "page-item"}>
                <button onClick={() => movePage("next")}
                  className="page-link"
                  >Next</button>
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

export default AllUsers
