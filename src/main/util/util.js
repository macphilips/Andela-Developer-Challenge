function isEmpty(str) {
  return !str || (typeof (str) === 'string' && str.length === 0);
}

module.exports = { isEmpty };
