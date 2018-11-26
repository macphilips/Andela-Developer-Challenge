import faker from 'faker';
import ResetPassword from '../../../component/profile/resetPassword';

test('should render ResetPassword', () => {
  const showToast = jest.fn();
  const changePassword = jest.fn();
  const updatingPassword = false;
  const props = {
    showToast,
    changePassword,
    updatingPassword
  };
  const wrapper = shallow(<ResetPassword {...props} />);
  const btn = wrapper.find('[type="button"]');
  btn.simulate('click');
  expect(changePassword)
    .not
    .toBeCalled();
  expect(showToast)
    .toBeCalled();

  const instance = wrapper.instance();
  const oldPassword = faker.internet.password();
  const newPassword = faker.internet.password();
  instance.setState({
    oldPassword,
    newPassword,
    matchPassword: '',
  });
  btn.simulate('click');

  const eventChangeEvent = {
    target: {
      name: 'matchPassword',
      value: newPassword,
    }
  };
  wrapper.find('#match-password')
    .simulate('change', eventChangeEvent);
  btn.simulate('click');

  expect(changePassword)
    .toBeCalled();
});
