import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class DeleteEntryDialog extends Component {
  dismiss = () => {
    this.props.dismissModal();
  };

  okClicked = () => {
    this.props.deleteEntry();
  };

  render() {
    return (
      <Fragment>
        <div className="modal-header">
            <span className="modal-header-title" role="heading">
                Confirm Delete
            </span>
          <span onClick={this.dismiss} data-dismiss="modal" className="action-btn close" role="button" tabIndex="0"
                aria-label="Close"/>
        </div>
        <div data-model="message" className="modal-body">This action delete entry from database.
          Are you sure you want to continue?
        </div>
        <div className="modal-footer">
          <button onClick={this.okClicked} data-action="ok" name="ok" className="btn-ok">OK</button>
          <button onClick={this.dismiss} data-dismiss="cancel" name="cancel">Cancel</button>
        </div>
      </Fragment>
    );
  }
}

DeleteEntryDialog.propTypes = {
  loading: PropTypes.bool,
  dismissModal: PropTypes.func,
  deleteEntry: PropTypes.func,
  showToast: PropTypes.func,
};
