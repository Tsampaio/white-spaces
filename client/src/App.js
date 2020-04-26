import React, {useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadUser } from './actions/auth';
import store from './store';
import Home from './components/pages/Home';
import Courses from './components/pages/Courses';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Logout from './components/pages/Logout';
import Profile from './components/private/Profile';
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
          <Route exact path="/" component={Home} />} />
          <Route exact path="/courses" component={Courses} />} />
          <Route path="/register" component={Register} />} />
          <Route path="/login" component={Login} />} />
          <Route path="/logout" component={Logout} />} />
          <PrivateRoute exact path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
