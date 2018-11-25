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
}, action) {
  const { type, ...payload } = action;
  switch (type) {
    case LOGGING_IN:
      return { ...state, ...payload };
    default:
      return state;
  }
}

// export default loading;
