import modal from '../../reducers/modal';
import { MODAL_ACTION } from '../../actions/modal';

test('MODAL_ACTION', () => {
  const state = {
    modal: {}
  };
  const action = {
    type: MODAL_ACTION,
    test: 'test'
  };
  const newState = modal(state, action);
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
  const newState = modal(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
