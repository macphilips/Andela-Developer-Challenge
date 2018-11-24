import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dismissToast } from '../../actions/notification';

import './styles.scss';

export class Toast extends Component {
  dismiss = () => {
    this.props.dismissToast();
  };

  render() {
    const {
      type, show, title, text
    } = this.props;
    if (!show) return null;
    return (
      <div id="toast" className={`toast ${type} ${(show) ? 'show' : 'dismiss'}`}>
        <div className="title">
          <span onClick={this.dismiss} className="close-btn">&times;</span>
          <p data-model="title" dangerouslySetInnerHTML={{ __html: title }}/>
        </div>
        <div>
          <p data-model="message" className="alert-msg" dangerouslySetInnerHTML={{ __html: text }}/>
        </div>
      </div>
    );
  }
}

Toast.propTypes = {
  dismissToast: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.oneOf(['error', 'success']),
};
const mapStateToProps = state => ({
  show: state.notification.toast.show,
  type: state.notification.toast.type,
  title: state.notification.toast.title,
  text: state.notification.toast.text,
});

export default connect(mapStateToProps, { dismissToast })(Toast);
