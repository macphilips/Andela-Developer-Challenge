import validator from 'validator';

export function padValue(value) {
  return (value < 10) ? `0${value}` : value;
}

export function getTimeString(date) {
  if (!date) return null;
  const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${padValue(date.getHours())}:${padValue(date.getMinutes())}`;
}

export function isEmpty(str) {
  if (str === undefined || str === null) return true;
  return (typeof (str) === 'string' && str.length === 0);
}

export function validateEmailAndPassword(user) {
  if (isEmpty(user.email)) {
    return 'Email address is required;';
  }

  // if (!isEmpty(user.email) && !validator.isLength(user.email, { min: 5, max: 100 })) {
  //   return 'Email address must be at least 5;';
  // }

  if (!isEmpty(user.email) && !validator.isEmail(user.email)) {
    return 'Email address is not valid;';
  }
  if (isEmpty(user.password) || !validator.isLength(user.password, { min: 8 })) {
    return 'Password must be at least 8;\n\r';
  }
  return null;
}
