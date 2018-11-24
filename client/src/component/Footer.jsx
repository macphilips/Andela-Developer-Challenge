import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export function Footer(props) {
  const fixed = (props.fixFooter) ? 'fixed-bottom white' : '';
  return (
    <div className={`${fixed}`}>
      <div className="page-footer">
        <div>&copy; 2018 MyDiary</div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  fixFooter: state.toolbar.fixFooter,
});

Footer.propTypes = {
  fixFooter: PropTypes.bool,
};
Footer.defaultProps = {
  fixFooter: false,
};

export default (connect(mapStateToProps, null)(Footer));
