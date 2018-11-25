import { REDIRECT_TO_REFERRER } from '../actions/redirect';

export function redirect(state = { signingIn: false }, action) {
  const { type, ...payload } = action;
  if (type === REDIRECT_TO_REFERRER) {
    return { ...state, ...payload };
  }
  return state;
}

export default redirect;
