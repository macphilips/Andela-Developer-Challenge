export const DOMDoc = document;


export const getFieldData = (e) => {
  const data = {};
  data[e.target.name] = e.target.value;
  return data;
};

// eslint-disable-next-line no-undef
const storage = localStorage;

export function storeToken(token) {
  storage.authenticationToken = token;
}

export function clearToken() {
  storage.clear();
}

export function getToken() {
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (storage.authenticationToken) {
      return storage.authenticationToken;
    }
  }
  return null;
}

export function printError(err) {
// eslint-disable-next-line no-console
  console.error(err);
}


/**
 *
 * @param value {number}
 * @returns {number}
 * @private
 */
export function padValue(value) {
  let result = Number(value);
  if (result >= 0 && result < 10) {
    result = `0${result}`;
  }
  return result;
}

/**
 *
 * @param value {number}
 * @param min {number}
 * @param max {number}
 * @returns {number}
 * @private
 */
export function roundTime(value, min, max) {
  let result = value;
  if (result < min) {
    result = min;
  } else if (result > max) {
    result = max;
  }
  return result;
}

export function calcUpStep(value, minuteStep) {
  return (value % minuteStep === 0)
    ? value + minuteStep : minuteStep * (parseInt(`${value / minuteStep}`, 10) + 1);
}

export function calcDownStep(value, minuteStep) {
  const round = (value === 0) ? 60 : value;
  return (value % minuteStep === 0)
    ? value - minuteStep : minuteStep * (parseInt(`${round / minuteStep}`, 10));
}

/**
 *
 * @param direction {string}
 * @param value {number}
 * @returns {number}
 * @private
 */
export function stepMinutesValue(direction, value) {
  let result = 0;
  const minuteStep = 15;
  if (!direction) return result;

  if (direction === 'up') {
    result = calcUpStep(value, minuteStep);
  } else if (direction === 'down') {
    result = calcDownStep(value, minuteStep);
  }
  return result;
}

/**
 *
 * @param value
 * @returns {*}
 */
export function roundAndPadValue(value) {
  let result = value;
  if (value < 0) {
    result = 23;
  } else if (value > 23) {
    result = '00';
  } else {
    result = padValue(value);
  }
  return result;
}
