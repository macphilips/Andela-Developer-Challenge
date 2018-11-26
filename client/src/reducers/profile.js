import { SET_PROFILE, SET_REMINDER, SET_SUMMARY } from '../actions/profile';

function profile(state = {
  user: {},
  reminder: {},
  summary: {}
}, action) {
  const { type, ...payload } = action;
  switch (type) {
    case SET_SUMMARY:
    case SET_REMINDER:
    case SET_PROFILE:
      return { ...state, ...payload };
    default:
      return state;
  }
}

export default profile;
