import { FIX_FOOTER, HIDE_NAV_BAR } from '../../actions/toolbar';
import toolbar from '../../reducers/toolbar';

test('FIX_FOOTER', () => {
  const state = {
    modal: {}
  };
  const action = {
    type: FIX_FOOTER,
    test: 'test'
  };
  const newState = toolbar(state, action);
  expect(newState)
    .toEqual({
      ...state,
      test: 'test'
    });
});
test('HIDE_NAV_BAR', () => {
  const state = {
    modal: {}
  };
  const action = {
    type: HIDE_NAV_BAR,
    test: 'test'
  };
  const newState = toolbar(state, action);
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
  const newState = toolbar(state, action);
  expect(newState)
    .toEqual({
      ...state,
    });
});
