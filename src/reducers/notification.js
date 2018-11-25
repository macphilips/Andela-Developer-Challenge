import { NOTIFICATION } from '../actions/notification';

export default function notification(state = {
  alert: {},
  toast: {}
}, action) {
  const { type, ...payload } = action;
  if (type === NOTIFICATION) {
    return { ...state, ...payload };
  }
  return state;
}
