import MockRouter from 'react-mock-router';
import { Redirect } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import store from '../store/index';

test('should render component', () => {
  mount(
    <MockRouter>
      <PrivateRoute
        component={() => (<div/>)}
        store={store}/>
    </MockRouter>
  );
});
test('should render redirect', () => {
  const wrapper = mount(
    <MockRouter>
      <PrivateRoute
        component={() => (<div/>)}
        location={{ pathname: '' }}
        store={store}/>
    </MockRouter>
  );
  expect(wrapper.find(Redirect)).toHaveLength(1);
});
