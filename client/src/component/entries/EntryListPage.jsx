import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BottomPagination from './BottomPagination';
import FloatingButton from './FloatingButton';
import EntryListItem from './EntryListItem';
import {
  DEFAULT_SIZE,
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry
} from '../../actions/entries';
import { dismissModal, openModal } from '../../actions/modal';
import EntryListHeader from './EntryListHeader';
import CreateEntry from './CreateEntry';
import ViewEntry from './ViewEntry';
import { showToast } from '../../actions/notification';
import DeleteEntryDialog from './DeleteEntryDialog';
import EmptyList from './EmptyList';
import { entryPropType, queryInfoPropType } from '../propsValidator';

export class EntryListPage extends React.Component {
  componentDidMount() {
    this.loadEntries();
  }

  loadEntries = () => {
    this.props.getEntries(this.props.queryInfo);
  };

  openCreateEntryModal = () => {
    this.openModal('create');
  };

  openModal = (action, entry) => {
    let content;
    const defaultProps = {
      dismissModal: this.props.dismissModal,
      showToast: this.props.showToast,
      entry,
      mode: action.toLowerCase(),
    };
    switch (action.toLowerCase()) {
      case 'create':
      case 'edit':
        content = this.getCreateOrEditContent(defaultProps, entry);
        break;
      case 'view':
        content = this.getViewContent(defaultProps, content);
        break;
      case 'delete':
        content = this.getDeleteContent(defaultProps, entry);
        break;
      default:
        return null;
    }
    return this.props.openModal(content);
  };

  getDeleteContent = (defaultProps, entry) => {
    const props = {
      ...defaultProps,
      deleteEntry: () => {
        this.props.deleteEntry(entry.id);
      }
    };
    return {
      component: DeleteEntryDialog,
      props
    };
  };

  getViewContent = (defaultProps) => {
    const props = {
      ...defaultProps,
    };
    return {
      component: ViewEntry,
      props
    };
  };

  getCreateOrEditContent = (defaultProps, entry) => {
    const props = {
      ...defaultProps,
      saveEntry: this.props.createEntry,
    };
    if (entry) {
      props.saveEntry = (data) => {
        this.props.updateEntry(entry.id, data);
      };
    }
    return {
      component: CreateEntry,
      props
    };
  };

  onPageChange = ({ page, size }) => {
    this.props.getEntries({
      page,
      size
    });
  };

  render() {
    if (!this.props.authenticated) return <Redirect to="/"/>;
    const { queryInfo, entryList } = this.props;
    return (
      <div className="main">
        <div id="entries" className="entries-container">
          <EntryListHeader
            queryInfo={queryInfo}
            onPageChange={this.onPageChange}
            onCreateEntryClicked={this.openCreateEntryModal}/>
          <div className="entry-list">
            {
              entryList.length > 0
              && entryList.map(entry => <EntryListItem
                onDropdownItemClicked={(action) => {
                  this.openModal(action, entry);
                }}
                key={entry.id} entry={entry}/>)
            }
            {
              entryList.length === 0
              && <EmptyList/>
            }
          </div>

          <BottomPagination
            queryInfo={queryInfo}
            onPageChange={this.onPageChange}
            id="paginationBottom"/>

          <FloatingButton onClicked={this.openCreateEntryModal}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated,
  entryList: state.entries.entryList,
  queryInfo: state.entries.queryInfo,
});

EntryListPage.propTypes = {
  getEntries: PropTypes.func.isRequired,
  updateEntry: PropTypes.func,
  createEntry: PropTypes.func,
  openModal: PropTypes.func,
  dismissModal: PropTypes.func,
  deleteEntry: PropTypes.func,
  showToast: PropTypes.func,
  authenticated: PropTypes.bool,
  entryList: PropTypes.arrayOf(entryPropType).isRequired,
  queryInfo: queryInfoPropType,
};

EntryListPage.defaultProps = {
  authenticated: false,
  queryInfo: {
    page: 1,
    size: DEFAULT_SIZE,
    total: 0
  }
};
export default withRouter(connect(mapStateToProps, {
  getEntries,
  updateEntry,
  createEntry,
  deleteEntry,
  openModal,
  dismissModal,
  showToast,
})(EntryListPage));
