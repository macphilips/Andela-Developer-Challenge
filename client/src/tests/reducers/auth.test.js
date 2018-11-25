import { authenticate } from '../../reducers/authUserReducer';
import { SET_AUTH } from '../../actions/authUser';

test('SET_AUTH', () => {
  const state = {
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
