import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('main');

render(
    <Router>
      <App/>
    </Router>, rootElement
);
