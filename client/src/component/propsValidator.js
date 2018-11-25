import PropTypes from 'prop-types';

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
