import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonLoader from '../ButtonLoader';
import userValidator from '../../userValidator';
import { getFieldData } from '../../utils/index';

export default class ResetPassword extends Component {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.view = React.createRef();
    this.state = {
      oldPassword: '',
      newPassword: '',
      matchPassword: '',
    };
  }

  updateState = (e) => {
    const data = getFieldData(e);
    this.setState({ ...data });
  };

  updatePasswordHandler = () => {
    const {
      newPassword, oldPassword, matchPassword
    } = this.state;

    const errors = userValidator.validatePassword(newPassword, matchPassword);
    if (errors) {
      this.props.showToast({
        title: 'Validation Error',
        text: errors,
        type: 'error',
        timeout: 5000,
      });
    } else {
      this.props.changePassword({
        oldPassword,
        newPassword
      });
    }
  };

  render() {
    const {
      oldPassword,
      newPassword,
      matchPassword,
    } = this.state;
    return (
      <section id="changePassword">
        <div className="section-title">
          <span>Change Password</span>
        </div>
        <hr/>
        <div className="section-content">
          <form id="changePasswordForm">
            <label htmlFor="password"><b>Old Password</b></label>
            <input
              value={oldPassword}
              onChange={this.updateState}
              className="form-input"
              id="prev-password"
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              required
            />
            <label htmlFor="password"><b>New Password</b></label>
            <input
              value={newPassword}
              onChange={this.updateState}
              className="form-input"
              id="password"
              type="password"
              placeholder="New Password"
              name="newPassword"
              required
            />
            <label htmlFor="match-password"><b>Confirm Password</b></label>
            <input
              value={matchPassword}
              onChange={this.updateState}
              className="form-input"
              id="match-password"
              type="password"
              placeholder="Confirm Password"
              name="matchPassword"
              required
            />
            <div className="btn-container">
              <button
                onClick={this.updatePasswordHandler}
                data-action="change-password"
                type="button"
                className="btn right"
              >
                {!this.props.updatingPassword && <span>Change Password</span>}
                {this.props.updatingPassword && <ButtonLoader/>}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

ResetPassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  updatingPassword: PropTypes.bool.isRequired,
};

ResetPassword.defaultProps = {};
