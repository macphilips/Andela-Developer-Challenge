import { UPDATING_PASSWORD, UPDATING_PROFILE, UPDATING_SETTINGS } from '../actions/profile';
import { LOGGING_IN, SET_AUTH } from '../actions/authUser';

export function authenticate(state = { authenticated: false }, action) {
  const { type, ...payload } = action;
  switch (type) {
    case SET_AUTH:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export function loading(state = {
  signingIn: false,
  updatingProfile: false
}, action) {
  const { type, ...payload } = action;
  switch (type) {
    case LOGGING_IN:
    case UPDATING_PROFILE:
    case UPDATING_PASSWORD:
    case UPDATING_SETTINGS:
      return { ...state, ...payload };
    default:
      return state;
  }
}

// export default loading;
