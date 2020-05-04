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
import Courses from './components/pages/Courses';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Logout from './components/pages/Logout';
import FGT_PASSWORD from './components/pages/ForgotPassword';
import RST_PASSWORD from './components/pages/ResetPassword';
import Profile from './components/private/Profile';
import Activate from './components/pages/Activate';
import ActivateEmail from './components/pages/ActivateEmail';
import PrivateRoute from './components/private/PrivateRoute';

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
          <Route path="/register" component={Register} />
          <Route exact path="/activate" component={Activate} />
          <Route exact path="/activate/:token" component={ActivateEmail} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/forgotPassword" component={FGT_PASSWORD} />
          <Route path="/resetPassword/:token" component={RST_PASSWORD} />
          <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
          <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
