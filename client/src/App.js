import React, {useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import store from './store';
import './fontawesome/css/all.min.css';
import Home from './components/pages/Home';
import Footer from './components/pages/Footer';
import Course from './components/pages/Course';
import Courses from './components/pages/Courses';
import CourseLessons from './components/pages/CourseLessons';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Logout from './components/pages/Logout';
import Checkout from './components/pages/Checkout';
import Membership from './components/pages/Membership';
import MembershipCheckout from './components/pages/MembershipCheckout';
import MembershipSuccess from './components/pages/MembershipSuccess';
import CheckoutSuccess from './components/pages/CheckoutSuccess';
import FGT_PASSWORD from './components/pages/ForgotPassword';
import RST_PASSWORD from './components/pages/ResetPassword';
import Profile from './components/private/Profile';
import Activate from './components/pages/Activate';
import ActivateEmail from './components/pages/ActivateEmail';
import PrivateRoute from './components/private/PrivateRoute';
import Admin from './components/pages/Admin';
import CourseCreate from './components/pages/CourseCreate';
import CourseUpdate from './components/pages/CourseUpdate';

function App() {
  useEffect( () => {
    console.log("Inside APP.js");
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/courses" component={Courses} />
          <Route exact path="/courses/:courseTag" component={Course} />
          <Route exact path="/courses/:courseTag/lessons/:lesson" component={CourseLessons} />  
          <Route path="/register" component={Register} />
          <Route exact path="/cart/checkout" component={Checkout} />
          <Route exact path="/cart/checkout/success" component={CheckoutSuccess} />
          <Route exact path="/membership" component={Membership} />
          <Route exact path="/membership/success" component={MembershipSuccess} />
          <Route exact path="/membership/:duration" component={MembershipCheckout} />
          
          <Route exact path="/activate" component={Activate} />
          <Route exact path="/activate/:token" component={ActivateEmail} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/forgotPassword" component={FGT_PASSWORD} />
          <Route path="/resetPassword/:token" component={RST_PASSWORD} />
          <Route exact path="/admin/courses" component={Admin} />
          <Route exact path="/admin/courses/create" component={CourseCreate} />
          <Route exact path="/admin/courses/update/:courseTag" component={CourseUpdate} />
          <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
          <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
