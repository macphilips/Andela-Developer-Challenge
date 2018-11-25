import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { entryPropType } from '../propsValidator';

export default class ViewEntry extends Component {
  render() {
    const { dismissModal } = this.props;
    const { title, content, lastModified } = this.props.entry;

    return (
      <div className="scrollable">
        <div className="modal-header">
          <div id="modal-header-title">
            <p data-model="lastModified">{lastModified}</p>
            <span data-model="title" className="modal-header-title">{title}</span>
          </div>
          <span
            onClick={() => {
              dismissModal();
            }}
            data-dismiss="modal"
            className="action-btn close"
            role="button"
            tabIndex="0"
            aria-label="Close"
          />
        </div>
        <div className="grow-body modal-body">
          <div className="content-container">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

ViewEntry.propTypes = {
  dismissModal: PropTypes.func,
  entry: entryPropType
};
