import { dismissModal, openModal } from '../../actions/modal';

test('should execute getEntries action, simulate successful request',
  async () => {
    const store = mockStore({});
    store.dispatch(openModal({}));
    const actions = store.getActions();
    expect(actions)
      .toHaveLength(1);
  });
test('should execute getEntries action, simulate failed request', async () => {
  const store = mockStore({});
  store.dispatch(dismissModal());
  const actions = store.getActions();
  expect(actions)
    .toHaveLength(1);
});
