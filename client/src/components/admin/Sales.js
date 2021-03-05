import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allUsersAction } from '../../actions/admin';
import { getSalesAction } from '../../actions/admin';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './AllUsers.css'

const Sales = () => {

  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const { token } = auth;

  const admin = useSelector(state => state.admin);
  const { sales } = admin;

  const [stateUsers, setStateUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    action: "",
    users: [],
  });

  const [salesState, setSalesState] = useState([]);
  const [pageSales, setPageSales] = useState({
    salesPerPage: 2,
    values: [],
    number: 1,
    firstPage: 0,
    lastPage: 1
  });

  // const [orderState, setOrderState] = useState({
  //   orderName: "",
  //   asc: false
  // })

  useEffect(() => {
    dispatch(getSalesAction());
  }, []);

  useEffect(() => {
    setSalesState(sales);

  }, [sales])

  useEffect(() => {
    setPageSales({
      ...pageSales,
      values: paginate(salesState, pageSales.salesPerPage, 1),
      lastPage: paginate(salesState, pageSales.salesPerPage, pageSales.number + 1).length
    });

  }, [salesState]);

  const allSales = pageSales.values.map((sale, i) => {
    const saleDate = new Date(sale.date);
    const newSaleDate = `${saleDate.getDate()}/${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;
    return (
      <tr key={i}>
        <td>{newSaleDate}</td>
        <td>
          <Link to={`/admin/user/${sale.user}`}>{sale.userEmail}</Link>
        </td>
        {/* <td>{sale.productName}</td> */}
        <td>
          {sale.productName.map((name, i) => {
            let comma =", ";
            if(i + 1 === sale.productName.length) {
              comma = "";
            }
            return <div key={i}>{name + comma}</div> ;
          }) }
        </td>
        <td>{sale.coupon ? sale.coupon : "-"}</td>
        <td>{sale.price}</td>
      </tr>
    )
  });

  function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  console.log(paginate(salesState, 1, 0));
  // console.log(paginate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4, 1));

  // const paginationButtons = salesState.map((sale, i) => {
  //   return <li key={i} class="page-item"><a onClick={() => setPageSales(paginate(salesState, 1, i + 1))} class="page-link" href="#">{i+1}</a></li>
  // })

  // useEffect(() => {
  //   if (!loading) {
  //     setStateUsers(users);
  //   }
  // }, [loading]);

  // useEffect(() => {
  //   console.log(stateUsers);
  //   const findSelected = stateUsers.find(user => {
  //     console.log(user);
  //     return user.selected
  //   });
  //   console.log(findSelected);

  //   setUserSelected(Boolean(findSelected));
  // }, [stateUsers])

  // const selectUsers = (usersSelected, event) => {
  //   // console.log(stateUsers);
  //   console.log(event.target.type)
  //   if (usersSelected === "all") {
  //     const selectAllUsers = stateUsers.map((user, i) => {
  //       // if () {
  //         // console.log(user);
  //         // console.log(selectAll)
  //         return {
  //           ...user,
  //           selected: !selectAll,
  //           key: i
  //         }
  //       // }
  //     });

  //     const filteredUsers = selectAllUsers.filter(user => {
  //       return user.role != "admin";
  //     });

  //     console.log(filteredUsers)
  //     setStateUsers(filteredUsers);
  //     setSelectAll(!selectAll);
  //   } else {
  //     const selectAllCopy = [...stateUsers];
  //     // selectAllCopy[usersSelected].selected = !selectAllCopy[usersSelected].selected;
  //     selectAllCopy[usersSelected].selected =  event.target.checked;

  //     setStateUsers(selectAllCopy);
  //   }

  // }

  // const allUsers = stateUsers.map((user, i) => {
  //   if (user.role !== "admin") {
  //     const joinedDate = new Date(user.joined);
  //     const newJoinedDate = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;
  //     // console.log("Inside all Users");
  //     // console.log(user.selected)
  //     return (
  //       <tr key={user._id}>
  //         <td>
  //           <input
  //             type="checkbox"
  //             checked={user.selected == null ? false : user.selected}
  //             value={user.selected}
  //             onChange={(e) => { selectUsers(i, e) }}
  //           />
  //           <div className="allUsersTableDiv"><Link to={`/admin/user/${user._id}`}>{user.name}</Link></div>
  //         </td>
  //         <td>
  //           <div className="allUsersTableDiv">{user.email}</div>
  //         </td>
  //         <td>
  //           <div className="allUsersTableDiv">{user.active}</div>
  //         </td>
  //         <td>
  //           <div className="allUsersTableDiv">${user.purchases} USD</div>
  //         </td>
  //         <td>
  //           <div className="allUsersTableDiv">{newJoinedDate}</div>
  //         </td>
  //       </tr>
  //     )
  //   }
  // })

  // const orderBy = (order) => {
  //   console.log("ordering by date");
  //   users.sort(function (a, b) {
  //     // Turn your strings into dates, and then subtract them
  //     // to get a value that is either negative, positive, or zero.
  //     if (order === "date") {
  //       if (orderState.orderName === "date" && orderState.asc) {
  //         return new Date(a.joined) - new Date(b.joined);
  //       } else {
  //         return new Date(b.joined) - new Date(a.joined);
  //       }
  //     } else if (order === "purchases") {
  //       if (orderState.orderName === "purchases" && orderState.asc) {
  //         return a.purchases - b.purchases;
  //       } else {
  //         return b.purchases - a.purchases;
  //       }
  //     } else if (order === "email") {
  //       if (orderState.orderName === "email" && orderState.asc) {
  //         if (a.email > b.email) { return -1; }
  //         if (a.email < b.email) { return 1; }
  //       } else {
  //         if (a.email < b.email) { return -1; }
  //         if (a.email > b.email) { return 1; }
  //       }
  //       return 0;
  //     } else if (order === "name") {
  //       let nameA = a.name.toLowerCase();
  //       let nameB = b.name.toLowerCase();

  //       if (orderState.orderName === "name" && orderState.asc) {
  //         if (nameA > nameB) { return -1; }
  //         if (nameA < nameB) { return 1; }
  //       } else {
  //         if (nameA < nameB) { return -1; }
  //         if (nameA > nameB) { return 1; }
  //       }

  //       return 0;
  //     } else if (order === "active") {
  //       let activeA = a.active.toLowerCase();
  //       let activeB = b.active.toLowerCase();

  //       if (orderState.orderName === "active" && orderState.asc) {
  //         if (activeA < activeB) { return -1; }
  //         if (activeA > activeB) { return 1; }
  //       } else {
  //         if (activeA > activeB) { return -1; }
  //         if (activeA < activeB) { return 1; }
  //       }
  //       return 0;
  //     }

  //   });

  //   setStateUsers(users);
  //   // setTest({ loading: false })
  //   setOrderState({
  //     orderName: order,
  //     asc: !orderState.asc
  //   })
  // }

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // const handleChange = (e) => {
  //   console.log(e.target.value);

  //   const selectedUsers = stateUsers.filter((user) => {
  //     return user.selected
  //   });

  //   console.log(selectedUsers)

  //   if (selectedUsers.length > 0) {
  //     let title = "";
  //     // let users = selectedUsers.map(user => {
  //     //   return user._id;
  //     // })
  //     if (e.target.value === "activate") {
  //       title = "Activate Users"
  //     } else if (e.target.value === "delete") {
  //       title = "Delete Users"
  //     }

  //     setModalText({
  //       title: title,
  //       action: e.target.value,
  //       users: selectedUsers
  //     });
  //     handleShow();
  //   }
  // }

  // const saveChanges = () => {
  //   console.log("inside save changes");
  //   if (modalText.action === "activate") {
  //     dispatch(saveUsersAction(modalText));
  //   } else if (modalText.action === "delete") {
  //     dispatch(deleteUsersAction(modalText));
  //   }
  //   setShow(false);
  // }

  // console.log(selectAll);
  // console.log(modalText);
  // console.log(stateUsers)
  const movePage = (direction) => {
    if (direction === "previous") {
      setPageSales({
        ...pageSales,
        values: paginate(salesState, pageSales.salesPerPage, pageSales.number - 1),
        number: pageSales.number - 1,
        firstPage: paginate(salesState, pageSales.salesPerPage, pageSales.number - 2).length,
        lastPage: paginate(salesState, pageSales.salesPerPage, pageSales.number).length
      })
    } else {
      console.log(pageSales.number);
      console.log(paginate(salesState, pageSales.salesPerPage, pageSales.number).length);
      setPageSales({
        ...pageSales,
        values: paginate(salesState, pageSales.salesPerPage, pageSales.number + 1),
        number: pageSales.number + 1,
        firstPage: paginate(salesState, pageSales.salesPerPage, pageSales.number).length,
        lastPage: paginate(salesState, pageSales.salesPerPage, pageSales.number + 2).length
      })
    }
  }

  // console.log(salesState);
  console.log(pageSales);

  // const checkEndPages = () => {
  //   return paginate(salesState, 1, pageSales.number + 1).length
  // }

  return (
    <div className="allUsersCtn container">
      <div className="row">
        <div className="col allUsersTable">
          <h5 className="mb-5">Showing {pageSales.number === 1 ? 1 : pageSales.number * pageSales.salesPerPage - 1} {(salesState.length <= pageSales.number * pageSales.salesPerPage) ? "" : " - " + pageSales.number * pageSales.salesPerPage } of {salesState.length} Transactions</h5>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Product</th>
                <th>Discount</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {/* {allUsers} */}
              {allSales}
            </tbody>
            {/* <h1>{!test.loading ? "Working" : null}</h1> */}
          </table>
        </div>

      </div>
      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={pageSales.firstPage < 1 ? "disabled page-item" : "page-item"}>
                <a onClick={() => movePage("previous")} className="page-link" href="#">Previous</a>
              </li>
              <li className={pageSales.lastPage < 1 ? "disabled page-item" : "page-item"}>
                <a onClick={() => movePage("next")} 
                  className="page-link" 
                  href="#">Next</a>
              </li>
            </ul>
          </nav>

        </div>
      </div>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {modalText.action} the following users?</p>
          {modalText.users.map((user,i) => {
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
      </Modal> */}

    </div>
  )
}

export default Sales;