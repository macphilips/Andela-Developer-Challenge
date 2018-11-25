import faker from 'faker';
import { SignupPage } from '../../component/SignupPage';

test('should render SignupPage', () => {
  const fixFooter = jest.fn();
  const hideNavBar = jest.fn();
  const showAlert = jest.fn();
  const createUser = jest.fn();
  const authenticated = false;
  const signingIn = false;
  const props = {
    authenticated,
    signingIn,
    fixFooter,
    hideNavBar,
    showAlert,
    createUser
  };
  const wrapper = shallow(<SignupPage {...props}/>);
  const btn = wrapper.find('[type="button"]');
  btn.simulate('click');
  expect(createUser)
    .not
    .toBeCalled();
  expect(showAlert)
    .toBeCalled();

  const instance = wrapper.instance();
  const password = faker.internet.password();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  instance.setState({
    firstName,
    lastName,
    password,
    matchPassword: faker.internet.password()
  });
  btn.simulate('click');
  instance.setState({
    matchPassword: password
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

  expect(createUser)
    .toBeCalled();
  expect(createUser)
    .toBeCalledWith({
      firstName,
      lastName,
      email,
      password
    });

  wrapper.unmount();
});
