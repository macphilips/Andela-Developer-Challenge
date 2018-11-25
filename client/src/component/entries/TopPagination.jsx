import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_SIZE } from '../../actions/entries';
import { queryInfoPropType } from '../propsValidator';

export class TopPagination extends React.Component {
  handlePageChange = (e) => {
    const { target } = e;
    const { queryInfo } = this.props;
    let { page } = queryInfo;
    const { total, size } = queryInfo;
    const totalPages = Math.max(Math.ceil(total / size), 1);
    const direction = target.getAttribute('data-direction');
    if (direction === 'next') {
      page += 1;
    } else {
      page -= 1;
    }
    if (page > 0 && page <= totalPages) {
      this.props.onPageChange({
        page,
        size: DEFAULT_SIZE
      });
    }
  };

  renderTop = () => {
    const { total, page, size } = this.props.queryInfo;
    const start = ((page - 1) * size) + 1;
    let end = page * size;
    end = (end > total) ? total : end;
    const visibleEntries = `${start} - ${end}`;
    return {
      totalEntries: total,
      visibleEntries,
      page
    };
  };

  render() {
    const { totalEntries, visibleEntries, page, } = this.renderTop();
    return (
      <div className="pagination-container">
        <div data-page-index={page}>
          <span data-model="visibleEntries">
            {visibleEntries}
          </span>
          &nbsp;
          <span>of</span>
          {' '}
          &nbsp;
          <span data-model="totalEntries">
            {totalEntries}
          </span>
        </div>
        <div className="pagination">
          <a className='prev-js' onClick={this.handlePageChange} data-direction="prev">❮</a>
          <a className='next-js' onClick={this.handlePageChange} data-direction="next">❯</a>
        </div>
      </div>
    );
  }
}

TopPagination.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  queryInfo: queryInfoPropType.isRequired
};

TopPagination.defaultProps = {
  queryInfo: {
    page: 1,
    size: DEFAULT_SIZE,
    total: 0
  }
};
export default (TopPagination);
