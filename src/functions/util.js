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
