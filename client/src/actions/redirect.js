export const REDIRECT_TO_REFERRER = 'REDIRECT TO REFERRER';

const saveReferrer = to => dispatch => dispatch({
  type: REDIRECT_TO_REFERRER,
  redirectToReferrer: { to },
});

export default saveReferrer;
