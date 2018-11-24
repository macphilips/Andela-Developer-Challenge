export const NOTIFICATION = 'SET NOTIFICATION';
export const alertNotification = (show, alert = {}) => ({
  type: NOTIFICATION,
  show,
  alert: { show, ...alert },
});
export const toastNotification = (show, toast = {}) => ({
  type: NOTIFICATION,
  toast: { show, ...toast },
});
export const dismissToast = () => dispatch => dispatch(toastNotification(false));
/**
 *
 * @param {{ type: 'error' | 'success', title: string, text: string, [timeout]: number}} data
 * @return {Function}
 */
export const showToast = data => (dispatch) => {
  dispatch(toastNotification(true, data));
  if (data.timeout) {
    setTimeout(() => {
      dispatch(dismissToast());
    }, data.timeout);
  }
};

export const dismissAlert = () => dispatch => dispatch(alertNotification(false));
/**
 *
 * @param {{ type: 'error' | 'success', text: string, timeout: number}} data
 * @return {Function}
 */
export const showAlert = data => (dispatch) => {
  dispatch(alertNotification(true, data));
  if (data.timeout) {
    setTimeout(() => {
      dispatch(dismissAlert());
    }, data.timeout);
  }
};
