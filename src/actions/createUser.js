import { apiRequest } from '../services/index';
import { loggingIn, setAuthentication } from './authUser';
import { showAlert, showToast } from './notification';

export const createAccount = details => async (dispatch) => {
  try {
    dispatch(loggingIn(true));
    await apiRequest.createUser(details);
    dispatch(setAuthentication(true));
    dispatch(showToast({ type: 'success', text: 'Account created', timeout: 8000 }));
  } catch (e) {
    dispatch(setAuthentication(false));
    dispatch(showAlert({ type: 'error', text: e.message }));
  } finally {
    dispatch(loggingIn(false));
  }
};

export default createAccount;
