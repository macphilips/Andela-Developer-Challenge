import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { account, http } from './services/index';
import { logoutUser, setAuthentication } from './actions/authUser';
import store from './store/index';
import App from './App';

import './index.scss';

const rootElement = document.getElementById('main');

http.event.attach(() => {
  store.dispatch(logoutUser());
});

account.identify()
  .then(() => store.dispatch(setAuthentication(true)))
  .catch(() => store.dispatch(setAuthentication(false)))
  .finally(() => {
    render(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>, rootElement
    );
  });
module.hot.accept();
