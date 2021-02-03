import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCouponIdAction,
  updateCouponAction,
} from '../../actions/admin';
import { getCourses } from '../../actions/courses';

import { Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { Form, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import './AllUsers.css';
import './Coupons.css';

const EditCoupon = () => {
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses);
  const { all } = courses;

  const admin = useSelector((state) => state.admin);
  const { coupon: theCoupon } = admin;

  const [coursesState, setCoursesState] = useState([]);
  const [coupon, setCoupon] = useState({
    amountType: 'percentage',
    amount: '',
    code: '',
    name: '',
    expires: '',
    available: '',
    emails: [],
    active: false,
  });

  const { courseTag: couponId } = useParams();

  // console.log(couponId);
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getCouponIdAction(couponId));
  }, []);

  useEffect(() => {
    const getDate = new Date(theCoupon.date);
    // console.log(getDate);
    // console.log(typeof getDate);
    if (getDate !== 'Invalid Date') {
      const newDate = `${getDate.getFullYear()}-${(
        '0' +
        getDate.getMonth() +
        1
      ).slice(-2)}-${('0' + getDate.getDate()).slice(-2)}`;
      // console.log(newDate);
      // console.log(typeof newDate);
      setCoupon({
        ...coupon,
        amount: theCoupon.amount,
        code: theCoupon.code,
        name: theCoupon.name,
        expires: newDate ? newDate : '2020-12-05',
        available: theCoupon.available,
        emails: theCoupon.restricted ? theCoupon.restricted : [],
        active: theCoupon.active,
      });
    }

    const addSelectCourses = theCoupon.courses ? theCoupon.courses : [];
    const coursesCopy = [...coursesState];

    for (let i = 0; i < coursesCopy.length; i++) {
      for (let j = 0; j < addSelectCourses.length; j++) {
        if (coursesCopy[i].name === addSelectCourses[j].name) {
          coursesCopy[i].selected = true;
        }
      }
    }

    setCoursesState(coursesCopy);
  }, [theCoupon]);

  useEffect(() => {
    const theCourses = all.map((course, i) => {
      return {
        courseId: course._id,
        name: course.name,
        selected: false,
        key: i,
      };
    });

    theCourses.push({ name: 'All Courses', selected: false });
    setCoursesState(theCourses);
  }, [all]);

  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
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
    </Button>
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
                !value || child.props.children.toLowerCase().startsWith(value)
            )}
          </ul>
        </div>
      );
    }
  );

  const selectCourse = (i) => {
    const coursesCopy = [...coursesState];
    if(coursesCopy[i].name === "All Courses") {
      for(let j=0; j < coursesCopy.length; j++ ) {
        if(coursesCopy[j].name !== "All Courses") {
          coursesCopy[j].selected = false;
        }
      }
    }

    coursesCopy[i].selected = !coursesCopy[i].selected;
    console.log(coursesCopy[i].name);
    setCoursesState(coursesCopy);
  };

  const coursesSelected = coursesState.map((course, i) => {
    return course.selected ? (
      <Button
        key={i}
        variant="warning"
        className="my-4 mr-4"
        onClick={() => selectCourse(i)}
      >
        {course.name}
      </Button>
    ) : (
      ''
    );
  });

  const allCourses = coursesState.map((course, i) => {
    return (
      <Dropdown.Item
        active={course.selected ? 'active' : ''}
        key={i}
        eventKey={i}
        onClick={() => selectCourse(i)}
      >
        {course.name}
      </Dropdown.Item>
    );
  });

  const coursesToCoupon = coursesState.filter((course, i) => {
    return course.selected;
  });

  const couponUpdate = (e) => {
    setCoupon({
      ...coupon,
      [e.target.name]:
        e.target.name === 'active' ? e.target.checked : e.target.value,
    });
  };

  const typingEmail = (e) => {
    setEmail(e.target.value);
  };

  const addEmails = (e) => {
    setCoupon({
      ...coupon,
      emails: [...coupon.emails, { email }],
    });
  };

  const removeEmails = (index) => {
    const emailRemove =
      coupon.emails.length > 0 &&
      coupon.emails.filter((email, i) => {
        return index !== i;
      });

    setCoupon({
      ...coupon,
      emails: emailRemove,
    });
  };

  const allEmails =
    coupon.emails.length > 0 &&
    coupon.emails.map((coupon, i) => {
      return (
        <Button
          className="mr-3"
          key={i}
          variant="outline-primary"
          onClick={() => removeEmails(i)}
        >
          {coupon.email}
        </Button>
      );
    });
  console.log(coupon);

  const updateCoupon = (e) => {
    e.preventDefault();
    dispatch(updateCouponAction(coursesToCoupon, coupon, couponId));
  };
  return (
    <div className="allUsersCtn container">
      <div className="row">
        <div className="col allUsersTable">
          <Button variant="dark" className="my-4">
            <Link to="/admin/coupons">Go back</Link>
          </Button>
          <div className="card">
            <div className="card-header">Edit Coupon</div>
            <div className="card-body">
              <form onSubmit={updateCoupon}>
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                    Select courses
                  </Dropdown.Toggle>
                  <Dropdown.Menu as={CustomMenu}>{allCourses}</Dropdown.Menu>
                </Dropdown>

                <div>{coursesSelected}</div>

                <select
                  className="form-control"
                  defaultValue={'DEFAULT'}
                  onChange={couponUpdate}
                  name="amountType"
                  value={coupon.amountType}
                >
                  <option value="DEFAULT" disabled>
                    Select Amount Type
                  </option>
                  <option value="dollars">Dollars</option>
                  <option value="percentage">Percentage</option>
                </select>
                <Form.Control
                  name="amount"
                  required
                  className="my-3 input-md"
                  type="text"
                  placeholder="Enter amount"
                  onChange={couponUpdate}
                  value={coupon.amount ? coupon.amount : ''}
                />

                <Form.Control
                  name="code"
                  required
                  className="my-3 input-md"
                  type="text"
                  placeholder="Coupon Code"
                  onChange={couponUpdate}
                  value={coupon.code ? coupon.code : ''}
                />
                <Form.Control
                  name="name"
                  required
                  className="my-3 input-md"
                  type="text"
                  placeholder="Coupon Name"
                  onChange={couponUpdate}
                  value={coupon.name ? coupon.name : ''}
                />
                <Form.Control
                  name="expires"
                  required
                  className="my-3 input-md"
                  type="date"
                  placeholder="Expires"
                  onChange={couponUpdate}
                  value={coupon.expires ? coupon.expires : ''}
                />
                <Form.Control
                  name="available"
                  required
                  className="my-3 input-md"
                  type="text"
                  placeholder="Number Available"
                  onChange={couponUpdate}
                  value={coupon.available ? coupon.available : ''}
                />

                <InputGroup className="my-3 input-md">
                  <FormControl
                    aria-label="Add Email"
                    aria-describedby="basic-addon2"
                    placeholder="Private Email"
                    name="emails"
                    onChange={typingEmail}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={addEmails}>
                      Add Email
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <div className="my-3">{allEmails}</div>

                <Form.Group id="formGridCheckbox">
                  <Form.Check
                    name="active"
                    type="checkbox"
                    label="Activate"
                    onChange={couponUpdate}
                    checked={coupon.active ? true : false}
                  />
                </Form.Group>
                <Button variant="primary" size="lg" type="submit">
                  Update Coupon
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
