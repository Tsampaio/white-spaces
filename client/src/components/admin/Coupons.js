import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { saveUsersAction, deleteUsersAction, createCouponAction } from '../../actions/admin';
import { getCourses } from '../../actions/courses'
// import ModalWindow from '../utils/ModalWindow';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form, Col, DropdownButton, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import './AllUsers.css';
import './Coupons.css'

const Coupon = () => {

  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { token } = auth;

  const admin = useSelector(state => state.admin);
  const { users, loading } = admin;

  const courses = useSelector(state => state.courses);
  const { all } = courses;
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

  const [coursesState, setCoursesState] = useState([]);
  const [coupon, setCoupon] = useState({
    amountType: "percentage",
    amount: "",
    code: "",
    name: "",
    expires: "",
    available: "",
    emails: [],
    active: false
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(allUsersAction());
    dispatch(getCourses());
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

  useEffect(() => {
    const theCourses = all.map((course, i) => {
      return {
        courseId: course._id,
        name: course.name,
        selected: false,
        key: i
      }
    })

    theCourses.push({ name: "All Courses", selected: false });
    setCoursesState(theCourses);

  }, [all]);

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

  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="mb-2 selectCourses form-control btn-primary"
    >
      {children}
    &#x25bc;
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}

        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}

          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

  const selectCourse = (i) => {

    const coursesCopy = [...coursesState];
    coursesCopy[i].selected = !coursesCopy[i].selected;

    setCoursesState(coursesCopy);
  }

  // const coursesSelected = coursesState.filter(course => {
  //   return course.selected
  // });

  const coursesSelected = coursesState.map((course, i) => {
    return course.selected ? <Button key={i} variant="warning" className="my-4 mr-4" onClick={() => selectCourse(i)}>{course.name}</Button> : ""
  })

  const allCourses = coursesState.map((course, i) => {
    return (
      <Dropdown.Item active={course.selected ? "active" : ""} key={i} eventKey={i} onClick={() => selectCourse(i)}>{course.name}</Dropdown.Item>
    )
  });

  const coursesToCoupon = coursesState.filter((course, i) => {
    return course.selected;
  });

  const couponUpdate = (e) => {
    setCoupon({
      ...coupon,
      [e.target.name]: e.target.name === "active" ? e.target.checked : e.target.value
    })
  }

  const submitCoupon = (e) => {
    e.preventDefault();
    if (coursesToCoupon.length < 1) {
      console.log("Need to select courses");
    }
    dispatch(createCouponAction(coursesToCoupon, coupon));
    console.log(coupon);
  }

  const typingEmail = (e) => {
    setEmail(e.target.value);
  }

  const addEmails = (e) => {
    setCoupon({
      ...coupon,
      emails: [...coupon.emails, {email}]
    })
  }

  const allEmails = coupon.emails.map((coupon, i) => {
    return <Button className="mr-3" key={i} variant="outline-primary">{coupon.email}</Button>
  })
  return (
    <div className="allUsersCtn container">
      <div className="row">
        <div className="col allUsersTable">
          <div className="card">
            <div className="card-header">
              New Coupon
            </div>
            <div className="card-body">
              <form onSubmit={submitCoupon}>
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                    Select courses
                  </Dropdown.Toggle>

                  <Dropdown.Menu as={CustomMenu}>
                    {/* <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                  <Dropdown.Item eventKey="3" active>
                    Orange
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item> */}
                    {allCourses}
                  </Dropdown.Menu>
                </Dropdown>
                <div>
                {coursesSelected}
                </div>

                <select className="form-control" defaultValue={'DEFAULT'} onChange={couponUpdate} name="amountType">
                  <option value="DEFAULT" disabled>Select Amount Type</option>
                  <option value="dollars">Dollars</option>
                  <option value="percentage">Percentage</option>
                </select>
                <Form.Control name="amount" required className="my-3 input-md" type="text" placeholder="Enter amount" onChange={couponUpdate} />
                
                <Form.Control name="code" required className="my-3 input-md" type="text" placeholder="Coupon Code" onChange={couponUpdate} />
                <Form.Control name="name" required className="my-3 input-md" type="text" placeholder="Coupon Name" onChange={couponUpdate} />
                <Form.Control name="expires" required className="my-3 input-md" type="date" placeholder="Expires" onChange={couponUpdate} />
                <Form.Control name="available" required className="my-3 input-md" type="text" placeholder="Number Available" onChange={couponUpdate} />
                {/* <div>
                  <Form.Control name="emails" className="my-3 input-md" type="text" placeholder="Private Email" size="6" onChange={couponUpdate} />
                  <Button variant="primary">Add Email</Button>
                </div>  */}

                <InputGroup className="my-3 input-md">
                  <FormControl
                    placeholder="Add Email"
                    aria-label="Add Email"
                    aria-describedby="basic-addon2"
                    placeholder="Private Email"
                    name="emails"
                    onChange={typingEmail}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={addEmails}>Add Email</Button>
                  </InputGroup.Append>
                  
                </InputGroup>
                <div className="my-3">{allEmails}</div>

                <Form.Group id="formGridCheckbox">
                  <Form.Check name="active" type="checkbox" label="Activate" onChange={couponUpdate} />
                </Form.Group>
                <Button variant="primary" size="lg" type="submit">
                  Create Coupon
              </Button>
              </form>
            </div>
          </div>


          <div className="row">
            <Col sm="5">
              <Form.Control className="my-3 input-md" type="text" placeholder="Search coupons" onChange={findUser} />
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
                      <span onClick={() => orderBy("name")}>Courses</span>
                    )}
                </th>
                <th onClick={() => orderBy("email")}>Name</th>
                <th onClick={() => orderBy("active")}>Discount Code</th>
                <th onClick={() => orderBy("purchases")}>Expires</th>
                <th onClick={() => orderBy("date")}>Discounts Left</th>
                <th onClick={() => orderBy("lastLogin")}>Restricted</th>
                <th onClick={() => orderBy("lastLogin")}>Active</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 ? allUsers : <tr className="my-3"><td>No Users found</td></tr>}
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
                <a onClick={() => movePage("previous")} className="page-link" href="#">Previous</a>
              </li>
              <li className={pageUsers.lastPage < 1 ? "disabled page-item" : "page-item"}>
                <a onClick={() => movePage("next")}
                  className="page-link"
                  href="#">Next</a>
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
