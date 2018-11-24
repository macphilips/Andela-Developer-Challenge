import MockRouter from 'react-mock-router';
import HomePages, { HomePage } from '../../component/HomePage';


test('should render Homepage', () => {
  const wrapper = mount(
    <MockRouter>
      <HomePage fixFooter={jest.fn()} authenticated={false}/>
    </MockRouter>
  );
  wrapper.unmount();
});
test('should render Homepage with store', () => {
  const store = mockStore({
    toolbar: { fixFooter: true },
    authenticate: { authenticated: true }
  });
  mount(
    <MockRouter>
      <HomePages fixFooter={jest.fn()} store={store}/>
    </MockRouter>
  );
});
