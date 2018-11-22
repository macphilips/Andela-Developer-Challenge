/* eslint-disable import/no-extraneous-dependencies */

/** Used in jest.config.js */
import React from 'react';
import {
  configure, mount, render, shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';

const middlewares = [thunk];

configure({ adapter: new Adapter() });

function MockNotification() {
}

MockNotification.title = '';
MockNotification.options = '';
MockNotification.permission = 'granted';
MockNotification.requestPermission = sinon.stub();

global.React = React;
global.Notification = MockNotification;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.sinon = sinon;
global.mockStore = configureStore(middlewares);
global.fetch = fetch;
