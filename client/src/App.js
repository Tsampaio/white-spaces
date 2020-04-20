import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/pages/Home';
import Courses from './components/pages/Courses';
import Register from './components/pages/Register';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />} />
          <Route exact path="/courses" component={Courses} />} />
          <Route path="/register" component={Register} />} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
