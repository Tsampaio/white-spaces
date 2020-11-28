import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
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
  const [bulkSelect, setBulkSelect] = useState(false)

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

  // useEffect(() => {
  //   const findSelected = stateUsers.find(user => {
  //     return user.selected
  //   });
  //   console.log(findSelected);
    
  //   setBulkSelect(Boolean(findSelected));
  // }, [bulkSelect])

  const selectUsers = (usersSelected) => {
    if(usersSelected === "all") {
      const selectAllUsers = stateUsers.map((user) => {
        return {
          ...user,
          selected: !selectAll
        }
      })

      setStateUsers(selectAllUsers);
      setSelectAll(!selectAll);
    } else {
      const  selectAllCopy = [...stateUsers];
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

  console.log(selectAll);
  console.log(stateUsers);
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
                  { bulkSelect ? (
                    <select>
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
    </div>
  )
}

export default AllUsers
