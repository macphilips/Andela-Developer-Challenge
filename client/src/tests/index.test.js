import App from '../App';

test('To test if jest is working', () => {
  expect(2 + 2)
    .toEqual(4);
});

test('should render App component without crashing', () => {
  shallow(<App/>);
});
