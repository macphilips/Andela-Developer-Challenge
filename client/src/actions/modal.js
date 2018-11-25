export const MODAL_ACTION = 'MODAL_ACTION';
const type = MODAL_ACTION;
const modal = (show, content = {}) => ({ type, show, content });

export const openModal = content => dispatch => dispatch(modal(true, content));

export const dismissModal = () => dispatch => dispatch(modal(false));
