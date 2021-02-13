import React, { Fragment, useState, useEffect } from 'react';
import SecondHeader from '../partials/SecondHeader';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { Col } from 'react-bootstrap';
import * as styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    randNumber1: Math.floor(Math.random() * 10 + 1),
    randNumber2: Math.floor(Math.random() * 10 + 1),
    formMessage: '',
    result: 0,
  });
  const {
    name,
    email,
    password,
    passwordConfirm,
    randNumber1,
    randNumber2,
    formMessage,
    result,
  } = formData;

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, message } = auth;

  useEffect(() => {
    if (formMessage) {
      setTimeout(() => {
        // resetMessage();
        console.log('formMessage deleted');
        setFormData({ ...formData, formMessage: '' });
      }, 5000);
    }
  }, [formMessage]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Inside register');
    if (password !== passwordConfirm) {
      // setAlert("Passwords do not match", 'danger', 3000);
      console.log('passwords');
      setFormData({ ...formData, formMessage: 'Passwords do not match' });
    } else if (randNumber1 + randNumber2 !== parseInt(result)) {
      console.log('results');
      console.log('Random Number 1', randNumber1);
      console.log(typeof randNumber1);
      console.log('Random Number 2', randNumber2);
      console.log('Result', result);
      console.log(randNumber1 === result);
      console.log(randNumber1 !== result);
      setFormData({ ...formData, formMessage: 'You are a robot!' });
    } else {
      console.log('Inside register action');
      dispatch(register({ name, email, password, passwordConfirm }));
      setFormData({
        ...formData,
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
      });
    }
  };

  const checkResult = (e) => {
    setFormData({ ...formData, result: e.target.value });
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  console.log(result);
  console.log(randNumber1);
  console.log(randNumber2);
  return (
    <Fragment>
      <SecondHeader />
      <div className={styles.registerCtn}>
        <div className="container">
          <div className="row">
            <Col xs={12} md={{ span: 6, offset: 3 }}>
              <div className={`card ${styles.registerCard}`}>
                <h1 className={styles.registerTitle}>Create Account</h1>
                <form className="form" onSubmit={(e) => onSubmit(e)}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      minLength="6"
                      value={password}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      name="passwordConfirm"
                      minLength="6"
                      value={passwordConfirm}
                      onChange={(e) => onChange(e)}
                    />
                  </div>

                  {randNumber1 && (
                    <div className={styles.antiBot} id="anti-bot">
                      <h3>I'm not a Robot</h3>
                      <span>{randNumber1}</span>
                      <span>+</span>
                      <span>{randNumber2}</span>
                      <span>=</span>
                      <input type="number" onChange={checkResult} />
                    </div>
                  )}

                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Register"
                  />
                </form>

                {formMessage && (
                  <div className={styles.registerError}>
                    <h1>{formMessage}</h1>
                  </div>
                )}

                {message && (
                  <div className={styles.registerSuccess}>
                    <h1>{message}</h1>
                  </div>
                )}
              </div>
              <p className={styles.goLogin}>
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </Col>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
