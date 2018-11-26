import { ProfilePage } from '../../../component/profile/ProfilePage';

test('should render ButtonLoader', () => {
  const updatingProfile = false;
  const updatingPassword = false;
  const changePassword = jest.fn();
  const getProfile = jest.fn();
  const updateReminder = jest.fn();
  const updatingSettings = true;
  const updateUserDetails = jest.fn();
  const showToast = jest.fn();
  const summary = {};
  const reminder = {};
  const profile = {
    firstName: '',
    lastName: '',
    email: ''
  };
  const props = {
    updateUserDetails,
    showToast,
    updatingSettings,
    updatingProfile,
    updatingPassword,
    changePassword,
    getProfile,
    updateReminder,
    summary,
    reminder,
    profile,
  };
  shallow(
    <ProfilePage {...props}/>
  );
});
