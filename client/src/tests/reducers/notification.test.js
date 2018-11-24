import { NOTIFICATION } from '../../actions/notification';
import notification from '../../reducers/notification';

test('NOTIFICATION', () => {
  const state = {
  };
  const action = {
    type: NOTIFICATION,
    test: 'test'
  };
  const newState = notification(state, action);
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
  const newState = notification(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
