import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import HomePage from './HomePage';
import SignupPage from './SignupPage';
import SigninPage from './SigninPage';
import EntryListPage from './entries/EntryListPage';
import PrivateRoute from '../PrivateRoute';

const Body = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage}/>
      <Route exact path="/signin" component={SigninPage} />
      <Route exact path="/signup" component={SignupPage}/>
      <PrivateRoute exact path="/dashboard" component={EntryListPage} />
      <Route component={NotFoundPage}/>
    </Switch>
  </main>
);
export default Body;
