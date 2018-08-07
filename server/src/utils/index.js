import validator from 'validator';
import HttpError from './httpError';

const daysOfTheWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export function padValue(value) {
  return (value < 10) ? `0${value}` : value;
}

export function getTimeString(date) {
  if (!date) return null;
  const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${padValue(date.getHours())}:${padValue(date.getMinutes())}`;
}

export function isEmpty(data) {
  let str = data;
  if (str === undefined || str === null) return true;
  str = str.trim();
  return (typeof (str) === 'string' && str.length === 0);
}

export function validateName(user) {
  const regExp = /^[a-zA-Z]+$/;
  if ((isEmpty(user.firstName))
    || (isEmpty(user.lastName))) {
    return 'First Name or Last Name cannot be empty';
  }
  if ((!validator.matches(user.firstName, regExp))
    || (!validator.matches(user.lastName, regExp))) {
    return 'First Name or Last Name can only contain characters between A - Z';
  }
  return null;
}

export function validateEmailAndPassword(user) {
  if (isEmpty(user.email)) {
    return 'Email address is required';
  }
  if (!isEmpty(user.email) && !validator.isEmail(user.email)) {
    return 'Email address is not valid;';
  }
  if (isEmpty(user.password) || !validator.isLength(user.password, { min: 8 })) {
    return 'Password must be at least 8;\n\r';
  }
  return validateName(user);
}

function isValidDayOfWeek(field) {
  let found = false;
  for (let i = 0; i < daysOfTheWeek.length; i += 1) {
    if (daysOfTheWeek[i] === field.toUpperCase()) {
      found = true;
      break;
    }
  }
  return found;
}

export function validateTime(reminder) {
  if (isEmpty(reminder.time)
    || isEmpty(reminder.from)
    || isEmpty(reminder.to)) {
    return '\'time\', \'from\', or \'to\' field cannot be empty';
  }

  // regex was gotten https://stackoverflow.com/a/20123018
  if (!validator.matches(reminder.time, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/i)) {
    return 'Invalid Time input: format HH:MM\n\r';
  }
  if (!isValidDayOfWeek(reminder.from) || !isValidDayOfWeek(reminder.to)) {
    return '\'from\' or \'to\' field is not a valid a day of the week';
  }
  return null;
}

export function validateEntry(entry) {
  if (isEmpty(entry.title)) {
    return '\'title\' field cannot be empty';
  }
  if (isEmpty(entry.content)) {
    return '\'content\' field cannot be empty';
  }
  if (!validator.isLength(entry.title, { min: 4 })) {
    return 'Title must be at least 4 characters long';
  }

  return null;
}

export function validateLoginInfo(user) {
  if (isEmpty(user.email)) {
    return 'Email address is required';
  }
  if (isEmpty(user.password)) {
    return 'Require Password\n\r';
  }
  return null;
}

export function mapAndWrapDbPromise(promise, mapper) {
  return promise.then(result => mapper(result))
    .catch(HttpError.wrapAndThrowError);
}

export function sameDayDateComparison(created) {
  const now = new Date();
  const within24h = parseInt((now.getTime() - created.getTime()) / 864e5, 10);
  return now.getDate() > created.getDate() && within24h > 0;
}

export function mapArray(array, mapper) {
  const entity = [];
  array.forEach((item) => {
    entity.push(mapper(item));
  });
  return Promise.resolve(entity);
}
