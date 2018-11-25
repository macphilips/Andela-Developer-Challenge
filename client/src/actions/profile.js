import { showToast } from './notification';
import { account, apiRequest, notificationService } from '../services/index';

export const UPDATING_PROFILE = 'UPDATING PROFILE';
export const UPDATING_PASSWORD = 'UPDATING PASSWORD';
export const UPDATING_SETTINGS = 'UPDATING SETTINGS';
export const SET_PROFILE = 'SET PROFILE';
export const SET_REMINDER = 'SET REMINDER';
export const SET_SUMMARY = 'SET SUMMARY';
export const NOTIFICATION = 'SET NOTIFICATION';

function dispatchErrorNotification(dispatch, err) {
  dispatch(showToast({
    title: 'Error',
    text: err.message,
    type: 'error',
    timeout: 8000
  }));
}

function dispatchSuccessNotification(dispatch, text) {
  dispatch(showToast({
    type: 'success',
    text,
    title: '',
    timeout: 8000
  }));
}

/**
 *
 * @returns {{type: string, signingIn: boolean}}
 * @param updatingProfile
 */
export const updatingUserProfile = updatingProfile => ({
  type: UPDATING_PROFILE,
  updatingProfile,
});

/**
 *
 * @returns {{type: string, updatingPassword: boolean}}
 * @param updatingPassword
 */
export const updatingUserPassword = updatingPassword => ({
  type: UPDATING_PASSWORD,
  updatingPassword,
});

/**
 *
 * @returns {{type: string, updatingSettings: boolean}}
 * @param updatingSettings
 */
export const updatingUserSettings = updatingSettings => ({
  type: UPDATING_SETTINGS,
  updatingSettings,
});


export const setProfile = user => ({
  type: SET_PROFILE,
  user,
});

export const setReminder = reminder => ({
  type: SET_REMINDER,
  reminder,
});

export const setSummary = summary => ({
  type: SET_SUMMARY,
  summary,
});

export const setProfileData = (user, summary, reminder) => ({
  type: SET_PROFILE,
  user,
  summary,
  reminder,
});

/**
 *
 * @param {boolean} force
 * @return {function(*): Promise<any | never>}
 */
export const getProfile = (force = false) => async (dispatch) => {
  try {
    const result = await account.identify(force);
    const { user, reminder, entry } = result.data;
    dispatch(setProfileData(user, entry, reminder));
  } catch (err) {
    dispatchErrorNotification(dispatch, err);
  }
};

/**
 *
 * @return {function(*): Promise<any | never>}
 * @param data
 */
export const updateProfile = data => async (dispatch) => {
  try {
    dispatch(updatingUserProfile(true));
    const result = await apiRequest.updateUserDetails(data);
    dispatch(setProfile(result.user));
    dispatchSuccessNotification(dispatch, 'Your profile has been updated successfully');
  } catch (err) {
    dispatchErrorNotification(dispatch, err);
  } finally {
    dispatch(updatingUserProfile(false));
  }
};

/**
 *
 * @return {function(*): Promise<any | never>}
 * @param data
 */
export const updatePassword = data => async (dispatch) => {
  try {
    dispatch(updatingUserPassword(true));
    await apiRequest.changePassword(data);
    const text = 'Successfully updated password';
    dispatchSuccessNotification(text);
  } catch (err) {
    dispatchErrorNotification(dispatch, err);
  } finally {
    dispatch(updatingUserPassword(false));
  }
};

/**
 *
 * @return {function(*): Promise<any | never>}
 * @param data
 */
export const updateSettings = data => async (dispatch) => {
  try {
    dispatch(updatingUserSettings(true));
    const result = await apiRequest.updateReminder(data);
    if (data.enabled) {
      notificationService.requestPermission();
    } else {
      notificationService.deleteToken()
        .then();
    }
    dispatch(setReminder(result));
    dispatchSuccessNotification(dispatch, 'Successfully updated notification settings');
  } catch (err) {
    dispatchErrorNotification(dispatch, err);
  } finally {
    dispatch(updatingUserSettings(false));
  }
};
