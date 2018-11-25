export default async function executeAction(action, data) {
  const store = mockStore({});
  await store.dispatch(action(data));
  return store.getActions();
}
