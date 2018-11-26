import { SET_PROFILE, SET_REMINDER, SET_SUMMARY } from '../../actions/profile';
import profile from '../../reducers/profile';

test('SET_SUMMARY', () => {
  const state = {
  };
  const action = {
    type: SET_SUMMARY,
    test: 'test'
  };
  const newState = profile(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});
test('SET_PROFILE', () => {
  const state = {
  };
  const action = {
    type: SET_PROFILE,
    test: 'test'
  };
  const newState = profile(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});
test('SET_REMINDER', () => {
  const state = {
  };
  const action = {
    type: SET_REMINDER,
    test: 'test'
  };
  const newState = profile(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});

test('NO_ACTION', () => {
  const state = {
    modal: {}
  };
  const action = {
    test: 'test'
  };
  const newState = profile(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
