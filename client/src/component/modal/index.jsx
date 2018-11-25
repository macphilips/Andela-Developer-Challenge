import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * @return {null}
 */
export function Modal(props) {
  const { content, display, loading } = props;
  const { component: Content, props: properties, } = content;
  if (!Content) return null;
  return (
    <div style={{ display }} id="modal-box" className="modal">
      <div className="modal-content">
        <Content loading={loading} {...properties}/>
      </div>
    </div>
  );
}

Modal.propTypes = {
  content: PropTypes.shape({
    component: PropTypes.any,
    props: PropTypes.object
  }),
  show: PropTypes.bool,
  loading: PropTypes.bool,
};

Modal.defaultProps = {
  content: {}
};
const mapStateToProps = state => ({
  loading: state.entries.loading,
  content: state.modal.content,
  display: (state.modal.show) ? 'block' : 'none',
});
export default connect(mapStateToProps)(Modal);
