import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class EntrySummary extends Component {
  render() {
    const { count, lastModified } = this.props.summary;
    return (
      <div id="entrySummary" className="entry-summary">
        <ul>
          <li>
            Total Entries:&nbsp;
            <span data-model="count">{count}</span>
          </li>
          <li>
            Last Update:
            {' '}
            <span data-model="lastModified">{lastModified}</span>
          </li>
        </ul>
      </div>);
  }
}

EntrySummary.propTypes = {
  summary: PropTypes.shape({
    count: PropTypes.number,
    lastModified: PropTypes.string,
  })
};

EntrySummary.defaultProps = {};
