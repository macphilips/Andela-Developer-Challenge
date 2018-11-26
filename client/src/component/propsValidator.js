import PropTypes from 'prop-types';

export const summaryPropType = PropTypes.shape({
  count: PropTypes.number,
  lastModified: PropTypes.string,
});

export const reminderPropType = PropTypes.shape({
  enabled: PropTypes.bool,
  from: PropTypes.string,
  to: PropTypes.string,
  time: PropTypes.string,
});

export const profilePropType = PropTypes.shape({
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
});

export const queryInfoPropType = PropTypes.shape({
  page: PropTypes.number,
  size: PropTypes.number,
  total: PropTypes.number,
});

export const entryPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  lastModified: PropTypes.string.isRequired,
});
