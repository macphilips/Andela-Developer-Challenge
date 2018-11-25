import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ButtonLoader from '../ButtonLoader';
import userValidator from '../../userValidator';
import { profilePropType } from '../propsValidator';
import { getFieldData } from '../../utils';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.view = React.createRef();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const { profile } = newProps;
    if (profile) {
      this.setState({ ...profile });
    }
  }

  updateState = (e) => {
    const data = getFieldData(e);
    this.setState({ ...data });
  };

  updateProfileHandler = () => {
    const { firstName, lastName, email } = this.state;

    const errors = userValidator.validateName(firstName, lastName)
      || userValidator.validateEmail(email);

    if (errors) {
      this.props.showToast({
        type: 'error',
        title: 'Validation Error',
        text: errors,
        timeout: 5000
      });
      return;
    }
    this.props.updateUserDetails({
      firstName,
      lastName,
      email
    });
  };

  render() {
    const {
      firstName, lastName, email
    } = this.state;
    return (
      <section id="profile">
        <div className="section-title">
          <span>Manage Profile</span>
        </div>
        <hr/>
        <div className="section-content">
          <form id="updateProfile" name="updateProfile">
            <div>
              <div className="row-col-2">
                <div>
                  <label htmlFor="first_name"><b>First name</b></label>
                  <input
                    value={firstName}
                    onChange={this.updateState}
                    data-model="firstName"
                    className="form-input"
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name"><b>Last name</b></label>
                  <input
                    value={lastName}
                    onChange={this.updateState}
                    data-model="lastName"
                    className="form-input"
                    id="last_name"
                    type="text"
                    placeholder="Last name"
                    name="lastName"
                    required
                  />
                </div>
              </div>
              <label htmlFor="email"><b>Email</b></label>
              <input
                value={email}
                onChange={this.updateState}
                data-model="email"
                className="form-input"
                id="email"
                type="email"
                placeholder="Enter Email"
                name="email"
                required
              />
              <div className="btn-container">
                <button
                  onClick={this.updateProfileHandler}
                  data-action="update-profile"
                  type="button"
                  className="btn right"
                >
                  {!this.props.updatingProfile && <span>Update Profile</span>}
                  {this.props.updatingProfile && <ButtonLoader/>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

Profile.propTypes = {
  updateUserDetails: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  updatingProfile: PropTypes.bool.isRequired,
  profile: profilePropType,
};

Profile.defaultProps = {};
