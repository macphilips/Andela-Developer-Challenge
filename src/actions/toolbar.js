export const HIDE_NAV_BAR = 'HIDE NAV BAR';
export const FIX_FOOTER = 'FIXED FOOTER';
/**
 *
 * @returns {{type: string, hideNavBar: *}}
 * @param hide
 */

export const hideNavBar = hide => ({
  type: HIDE_NAV_BAR,
  hideNavBar: hide,
});

/**
 *
 * @returns {{type: string, fixFooter: *}}
 * @param fixed
 */
export const fixFooter = fixed => ({
  type: FIX_FOOTER,
  fixFooter: fixed,
});
