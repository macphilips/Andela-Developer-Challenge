import {
  showToast, dismissToast, showAlert, dismissAlert
} from '../../actions/notification';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  test('should execute getEntries action, simulate successful request',
    async () => {
      const store = mockStore({});
      store.dispatch(showToast({ timeout: 5000 }));
      jest.runAllTimers();
      const actions = store.getActions();
      expect(actions)
        .toHaveLength(2);
    });
  test('should execute getEntries action, simulate failed request', async () => {
    const store = mockStore({});
    store.dispatch(dismissToast({}));
    const actions = store.getActions();
    expect(actions)
      .toHaveLength(1);
  });
});
describe('Alert', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  test('should execute getEntries action, simulate successful request',
    async () => {
      const store = mockStore({});
      store.dispatch(showAlert({ timeout: 5000 }));
      jest.runAllTimers();
      const actions = store.getActions();
      expect(actions)
        .toHaveLength(2);
    });
  test('should execute getEntries action, simulate failed request', async () => {
    const store = mockStore({});
    store.dispatch(dismissAlert({}));
    const actions = store.getActions();
    expect(actions)
      .toHaveLength(1);
  });
});
