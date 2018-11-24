import { FIX_FOOTER, HIDE_NAV_BAR } from '../actions/toolbar';

export default function toolbar(state = { fixFooter: false, hideNavBar: false }, action) {
  const { type, ...payload } = action;
  switch (type) {
    case FIX_FOOTER:
    case HIDE_NAV_BAR:
      return { ...state, ...payload };
    default:
      return state;
  }
}
