import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_SIZE } from '../../actions/entries';
import { queryInfoPropType } from '../propsValidator';

export class BottomPagination extends Component {
  constructor(props) {
    super(props);
    this.view = React.createRef();
  }

  handlePageChange = (e) => {
    const { target } = e;
    let { page } = this.props.queryInfo;
    const { total, size } = this.props.queryInfo;
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

  renderBottom = () => {
    const { total, page, size } = this.props.queryInfo;
    const totalPages = Math.max(Math.ceil(total / size), 1);
    return `Page ${page} of ${totalPages}`;
  };

  render() {
    return (
      <div className="center">
        <div className="pagination">
          <a className='prev-js' onClick={this.handlePageChange} data-direction="prev">❮</a>
          <a data-model="page" className="disable">{this.renderBottom()}</a>
          <a className='next-js' onClick={this.handlePageChange} data-direction="next">❯</a>
        </div>
      </div>
    );
  }
}

BottomPagination.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  queryInfo: queryInfoPropType.isRequired
};

BottomPagination.defaultProps = {
  queryInfo: {
    page: 1,
    size: DEFAULT_SIZE,
    total: 0
  }
};
export default BottomPagination;
