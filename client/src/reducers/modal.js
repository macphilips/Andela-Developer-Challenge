import { MODAL_ACTION } from '../actions/modal';

function modal(state = {}, action) {
  const { type, ...payload } = action;
  if (type === MODAL_ACTION) {
    return { ...state, ...payload };
  }
  return state;
}

export default modal;
