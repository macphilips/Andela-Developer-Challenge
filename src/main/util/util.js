function getTimeString(date) {
  const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function isEmpty(str) {
  return !str || (typeof (str) === 'string' && str.length === 0);
}

module.exports = { getTimeString, isEmpty };
