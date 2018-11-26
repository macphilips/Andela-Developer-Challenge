import { authenticate, loading } from '../../reducers/authUserReducer';
import { UPDATING_PASSWORD, UPDATING_PROFILE, UPDATING_SETTINGS } from '../../actions/profile';
import { LOGGING_IN, SET_AUTH } from '../../actions/authUser';

test('SET_AUTH', () => {
  const state = {
    modal: {}
  };
  const action = {
    type: SET_AUTH,
    test: 'test'
  };
  const newState = authenticate(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});

test('authenticate NO_ACTION', () => {
  const state = {
    modal: {}
  };
  const action = {
    test: 'test'
  };
  const newState = authenticate(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});

test('UPDATING_PROFILE', () => {
  const state = {
    modal: {}
  };
  let action = {
    type: LOGGING_IN,
    test: 'test'
  };
  let newState = loading(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
  action = {
    type: UPDATING_PROFILE,
    test: 'test'
  };
  newState = loading(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
  action = {
    type: UPDATING_PASSWORD,
    test: 'test'
  };
  newState = loading(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
  action = {
    type: UPDATING_SETTINGS,
    test: 'test'
  };
  newState = loading(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});

test('loading NO_ACTION', () => {
  const state = {
    modal: {}
  };
  const action = {
    test: 'test'
  };
  const newState = loading(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
