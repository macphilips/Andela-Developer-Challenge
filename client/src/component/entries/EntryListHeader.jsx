import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopPagination from './TopPagination';
import { DEFAULT_SIZE } from '../../actions/constants';
import { queryInfoPropType } from '../propsValidator';

export default class EntryListHeader extends Component {
  createEntry = () => {
    this.props.onCreateEntryClicked();
  };

  render() {
    return (
      <div>
        <div className="header">
          <span className="title">Your Diary Entries</span>
          <div className="add-entry">
            <a onClick={this.createEntry} id="addEntry" title="Add Entry" className="btn create add-btn-js" role="button">
              Add
              Diary Entry
            </a>
          </div>
        </div>
        <TopPagination {...this.props} id="paginationTop"/>
      </div>
    );
  }
}

EntryListHeader.propTypes = {
  onCreateEntryClicked: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  queryInfo: queryInfoPropType.isRequired
};

EntryListHeader.defaultProps = {
  queryInfo: {
    page: 1,
    size: DEFAULT_SIZE,
    total: 0
  }
};
