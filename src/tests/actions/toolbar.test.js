import { fixFooter, hideNavBar } from '../../actions/toolbar';

test('should execute getEntries action, simulate successful request',
  async () => {
    const store = mockStore({});
    store.dispatch(fixFooter({ timeout: 5000 }));
    const actions = store.getActions();
    expect(actions)
      .toHaveLength(1);
  });
test('should execute getEntries action, simulate failed request', async () => {
  const store = mockStore({});
  store.dispatch(hideNavBar({}));
  const actions = store.getActions();
  expect(actions)
    .toHaveLength(1);
});

