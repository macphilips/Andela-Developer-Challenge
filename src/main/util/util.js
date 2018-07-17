function padValue(value) {
  return (value < 10) ? `0${value}` : value;
}

function getTimeString(date) {
  const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${padValue(date.getHours())}:${padValue(date.getMinutes())}`;
}

function isEmpty(str) {
  return !str || (typeof (str) === 'string' && str.length === 0);
}

module.exports = { getTimeString, isEmpty };
