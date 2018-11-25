import { loginService } from '../services/index';
import { showAlert } from './notification';
import { printError } from '../utils';

export const USER_LOGOUT = 'USER_LOGOUT';
export const LOGGING_IN = 'LOGGING_IN';
/**
 *
 * @param signingIn {boolean}
 * @returns {{type: string, signingIn: boolean}}
 */
export const loggingIn = signingIn => ({
  type: LOGGING_IN,
  signingIn,
});

export const SET_AUTH = 'SET AUTHENTICATION';
/**
 *
 * @param authenticated {boolean}
 * @returns {{type: string, authenticated: boolean}}
 */
export const setAuthentication = authenticated => ({
  type: SET_AUTH,
  authenticated,
});

export const loginUser = credentials => async (dispatch) => {
  try {
    dispatch(loggingIn(true));
    await loginService.login(credentials);
    dispatch(setAuthentication(true));
  } catch (e) {
    dispatch(setAuthentication(false));
    dispatch(showAlert({
      type: 'error',
      text: e.message
    }));
  } finally {
    dispatch(loggingIn(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGOUT });
  } catch (error) {
    printError(error);
  } finally {
    loginService.logout();
    dispatch(setAuthentication(false));
  }
};
