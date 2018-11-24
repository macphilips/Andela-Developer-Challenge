import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dismissAlert } from '../../actions/notification';

import './styles.scss';

export class Alert extends Component {
  dismiss = () => {
    this.props.dismissAlert();
  };

  componentWillUnmount() {
    this.dismiss();
  }

  render() {
    const { type, show, text } = this.props;
    return (
      <div id="alert" className={`alert ${type} ${(show) ? 'show' : 'dismiss'}`}>
        <p className="alert-msg" dangerouslySetInnerHTML={{ __html: text }}/>
        <span onClick={this.dismiss} className="close-btn">&times;</span>
      </div>
    );
  }
}

Alert.propTypes = {
  dismissAlert: PropTypes.func,
  show: PropTypes.bool,
  text: PropTypes.string,
  type: PropTypes.oneOf(['error', 'success']),
};
const mapStateToProps = state => ({
  show: state.notification.alert.show,
  type: state.notification.alert.type,
  text: state.notification.alert.text,
});

export default connect(mapStateToProps, { dismissAlert })(Alert);
