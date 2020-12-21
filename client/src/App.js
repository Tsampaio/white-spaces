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
import Activate from './components/pages/Activate';
import ActivateEmail from './components/pages/ActivateEmail';
import Admin from './components/admin/AdminCtn';
// import CourseCreate from './components/admin/CourseCreate';
// import CourseUpdate from './components/pages/CourseUpdate';
import ProfileCtn from './components/private/ProfileCtn';

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
          <Route exact path="/admin/:page" component={Admin} />
          <Route exact path="/admin/:page/:subPage" component={Admin} />
          <Route exact path="/admin/:page/:subPage/:courseTag" component={Admin} />
          <Route exact path="/featureCourses" component={Admin} />
          <Route exact path="/profile" component={ProfileCtn} />
          <Route exact path="/profile/:page" component={ProfileCtn} />
        </Switch>
          <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
