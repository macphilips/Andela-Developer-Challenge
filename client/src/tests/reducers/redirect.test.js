import { REDIRECT_TO_REFERRER } from '../../actions/redirect';
import redirect from '../../reducers/redirect';
import notification from '../../reducers/notification';

test('REDIRECT_TO_REFERRER', () => {
  const state = {
    modal: {}
  };
  const action = {
    type: REDIRECT_TO_REFERRER,
    test: 'test'
  };
  const newState = redirect(state, action);
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
  const newState = redirect(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
