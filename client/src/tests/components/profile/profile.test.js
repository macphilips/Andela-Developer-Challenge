import faker from 'faker';
import Profile from '../../../component/profile/profile';

test('should render ButtonLoader', () => {
  const updatingProfile = false;
  const updateUserDetails = jest.fn();
  const showToast = jest.fn();
  const profile = {
    firstName: '',
    lastName: '',
    email: ''
  };
  const props = {
    updateUserDetails,
    showToast,
    updatingProfile,
    profile,
  };
  const wrapper = shallow(
    <Profile {...props}/>
  );
  const btn = wrapper.find('[type="button"]');
  btn.simulate('click');
  expect(updateUserDetails)
    .not
    .toBeCalled();
  expect(showToast)
    .toBeCalled();

  const instance = wrapper.instance();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  instance.setState({
    firstName,
    lastName,
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
  wrapper.setProps({
    profile: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    }
  });
  wrapper.update();
  instance.forceUpdate();

  expect(updateUserDetails)
    .toBeCalled();
});
