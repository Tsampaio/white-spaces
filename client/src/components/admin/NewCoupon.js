import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCouponAction } from '../../actions/admin';
import { getCourses } from '../../actions/courses'

import { Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form, InputGroup, Dropdown, FormControl } from 'react-bootstrap';
import './AllUsers.css';
import './Coupons.css'

const NewCoupon = () => {

  const dispatch = useDispatch();

  const courses = useSelector(state => state.courses);
  const { all } = courses;

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
    dispatch(getCourses());
  }, []);

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
          <Link to="/admin/coupons">Go back</Link>
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
                    {allCourses}
                  </Dropdown.Menu>
                </Dropdown>

                <div>{coursesSelected}</div>

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
          
        </div>
      </div>
    </div>
  )
}

export default NewCoupon;
