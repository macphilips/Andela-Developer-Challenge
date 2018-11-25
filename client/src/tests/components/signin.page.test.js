import faker from 'faker';
import { SigninPage } from '../../component/SigninPage';

test('should render SignupPage', () => {
  const fixFooter = jest.fn();
  const hideNavBar = jest.fn();
  const showAlert = jest.fn();
  const login = jest.fn();
  const createUser = jest.fn();
  const authenticated = true;
  const signingIn = false;
  const redirectToReferrer = { to: 'url' };
  const props = {
    authenticated,
    signingIn,
    fixFooter,
    hideNavBar,
    showAlert,
    createUser,
    login,
    redirectToReferrer
  };
  shallow(<SigninPage {...props}/>);
});

test('should render SigninPage', () => {
  const fixFooter = jest.fn();
  const hideNavBar = jest.fn();
  const showAlert = jest.fn();
  const login = jest.fn();
  const authenticated = false;
  const signingIn = false;
  const props = {
    authenticated,
    signingIn,
    fixFooter,
    hideNavBar,
    showAlert,
    login
  };
  const wrapper = shallow(
    <SigninPage {...props}/>
  );
  const btn = wrapper.find('[type="button"]');
  btn.simulate('click');
  expect(login)
    .not
    .toBeCalled();
  expect(showAlert)
    .toBeCalled();

  const instance = wrapper.instance();
  const password = faker.internet.password();
  const email = faker.internet.email();
  instance.setState({
    password,
  });
  btn.simulate('click');

  const eventChangeEvent = {
    target: {
      name: 'email',
      value: email,
    }
  };
  wrapper.find('#email')
    .simulate('change', eventChangeEvent);
  btn.simulate('click');

  expect(login)
    .toBeCalled();
  expect(login)
    .toBeCalledWith({
      email,
      password
    });

  wrapper.unmount();
});
