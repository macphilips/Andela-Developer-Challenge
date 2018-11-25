import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import App from './App';

import './index.scss';

const rootElement = document.getElementById('main');
render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>, rootElement
);
