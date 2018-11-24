import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import HomePage from './HomePage';

const Body = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </main>
);
export default Body;
