import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ButtonLoader from '../ButtonLoader';
import { entryPropType } from '../propsValidator';

export default class CreateEntry extends Component {
  constructor(props) {
    super(props);
    const { entry } = this.props;
    let content = '',
      title = '',
      lastModified = '';
    if (entry) {
      ({
        content,
        title,
        lastModified
      } = entry);
    }
    this.state = {
      content,
      title,
      lastModified
    };
  }

  updateState = (e) => {
    const data = {};
    data[e.target.name] = e.target.value;
    this.setState({ ...data });
  };

  validateTitle = (title) => {
    const titlePattern = /^[a-zA-Z0-9\-\s&]{8,80}$/;

    if (title) {
      title = title.trim();
    }

    if (title && title.match(titlePattern)) return null;
    let message;
    if (title.length > 80) {
      message = 'Title must not exceed 80 characters';
    } else if (title.length < 8) {
      message = 'Title must be at least 8 characters';
    } else {
      message = 'Title can only contain number, alphabets, space or dash [ - ]';
    }
    return message;
  };

  validateContent = (content) => {
    if (content) {
      content = content.trim();
    }

    let message;
    if (content.length < 8) {
      message = 'Content must be at least 8 characters';
    }
    return message;
  };

  onSave = () => {
    const { content, lastModified, title } = this.state;
    const error = this.validateTitle(title) || this.validateContent(content);
    if (error) {
      this.props.showToast({
        type: 'error',
        title: 'Validation Error',
        text: error,
        timeout: 8000
      });
      return;
    }
    this.props.saveEntry({
      content,
      lastModified,
      title
    });
  };

  dismiss = () => {
    this.props.dismissModal();
  };

  render() {
    return (
      <div className="flexbox-parent scrollable">
        <div id="alert" className="alert error">
          <p className="alert-msg"/>
          <span className="close-btn">&times;</span>
        </div>
        <div className="modal-header">
          <div id="modal-header-title">
            <p data-model="lastModified"/>
            <input
              onChange={this.updateState}
              value={this.state.title}
              name='title'
              data-model="title"
              placeholder="Title"
              className="form-input modal-header-input"
            />
          </div>
          <span onClick={this.dismiss}
                data-dismiss="modal"
                className="action-btn close"
                role="button"
                tabIndex="0"
                aria-label="Close"
          />
        </div>
        <div className="grow-body modal-body">
          <div className="create-entry">
            <textarea
              name='content'
              onChange={this.updateState}
              value={this.state.content}
              placeholder="Dear Diary, " id="entry"/>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={this.onSave} data-action="save" type="button" className="btn-save">
            {
              this.props.loading
              && <ButtonLoader/>
            } {
            !this.props.loading
            && <span>Save</span>
          }
          </button>
          <button onClick={this.dismiss} data-dismiss="cancel" type="button"
                  className="btn-cancel">Cancel
          </button>
        </div>
      </div>
    );
  }
}

CreateEntry.propTypes = {
  saveEntry: PropTypes.func,
  loading: PropTypes.bool,
  dismissModal: PropTypes.func,
  showToast: PropTypes.func,
  mode: PropTypes.oneOf(['edit', 'create']),
  entry: entryPropType
};
