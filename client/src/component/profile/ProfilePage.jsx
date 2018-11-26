/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { showToast } from '../../actions/notification';
import {
  getProfile, updatePassword, updateProfile, updateSettings
} from '../../actions/profile';
import Reminder from './reminder';
import Profile from './profile';
import ResetPassword from './resetPassword';
import EntrySummary from './entrySummary';
import { profilePropType, reminderPropType, summaryPropType } from '../propsValidator';

export class ProfilePage extends React.Component {
  componentDidMount() {
    this.props.getProfile(true);
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <EntrySummary summary={this.props.summary}/>
          <div className="section">
            <Reminder {...this.props}/>
            <Profile {...this.props}/>
            <ResetPassword {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  updatingProfile: state.loading.updatingProfile,
  updatingSettings: state.loading.updatingSettings,
  updatingPassword: state.loading.updatingPassword,
  profile: state.profile.user,
  reminder: state.profile.reminder,
  summary: state.profile.summary,
});

ProfilePage.propTypes = {
  getProfile: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
  updateReminder: PropTypes.func.isRequired,
  updateUserDetails: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  updatingProfile: PropTypes.bool.isRequired,
  updatingPassword: PropTypes.bool.isRequired,
  updatingSettings: PropTypes.bool.isRequired,
  profile: profilePropType,
  reminder: reminderPropType,
  summary: summaryPropType
};

ProfilePage.defaultProps = {
  profile: null,
  reminder: null,
  summary: null,
  updatingProfile: false,
  updatingPassword: false,
  updatingSettings: false,
};

export default withRouter(connect(mapStateToProps, {
  getProfile,
  changePassword: updatePassword,
  updateReminder: updateSettings,
  updateUserDetails: updateProfile,
  showToast,
})(ProfilePage));
