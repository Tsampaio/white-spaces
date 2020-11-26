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

  const allUsers = stateUsers.map((user, i) => {

    const joinedDate = new Date(user.joined);
    const newJoinedDate = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;
    console.log("Inside all Users");
    console.log(newJoinedDate)
    return (
      <tr key={user._id}>
        <td>
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
    setTest({loading: false})
  }

  console.log(stateUsers);
  return (
    <div className="allUsersCtn">
      <h1>Show 1 - 25 of {stateUsers.length} Students</h1>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th onClick={() => orderBy("name")}>Name</th>
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
  )
}

export default AllUsers
