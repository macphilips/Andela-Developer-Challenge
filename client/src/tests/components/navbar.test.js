import MockRouter from 'react-mock-router';
import Navbars, { Navbar } from '../../component/Navbar';

// jest.mock('../../services/notificationSettings');

test('should render Navbar', () => {
  const wrapper = mount(
    <MockRouter>
      <Navbar logoutUser={jest.fn()} authenticated={true} hideNavBar={false}/>
    </MockRouter>
  );
  const getAttribute = jest.fn();
  const contains = jest.fn();
  getAttribute.mockReturnValueOnce('show');
  getAttribute.mockReturnValueOnce('hide');
  const eventMock = {
    target: {
      getAttribute,
      classList: {
        contains
      }
    }
  };
  wrapper.find('[data-action="show"]')
    .simulate('click', eventMock);
  wrapper.find('[data-action="hide"]')
    .simulate('click', eventMock);

  contains.mockReturnValueOnce(true);
  wrapper.find('.side-nav')
    .simulate('click', eventMock);

});
test('should render Navbar with store', () => {
  const store = mockStore({
    toolbar: { fixFooter: true },
    authenticate: { authenticated: true }
  });
  mount(
    <MockRouter>
      <Navbars store={store}/>
    </MockRouter>
  );
});
