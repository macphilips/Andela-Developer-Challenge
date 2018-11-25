import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from './notification/Alert';
import createAccount from '../actions/createUser';
import ButtonLoader from './ButtonLoader';
import { fixFooter, hideNavBar } from '../actions/toolbar';
import { showAlert } from '../actions/notification';
import userValidator from '../userValidator';

export class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      matchPassword: '',
    };
    this.props.hideNavBar(true);
    this.props.fixFooter(true);
  }

  componentDidMount() {
    this.props.hideNavBar(true);
    this.props.fixFooter(true);
  }

  componentWillUnmount() {
    this.props.hideNavBar(false);
    this.props.fixFooter(false);
  }

  updateState = (e) => {
    const data = {};
    data[e.target.name] = e.target.value;
    this.setState({ ...data });
  };

  createUser = () => {
    const {
      firstName, lastName, email, password, matchPassword
    } = this.state;
    const errors = userValidator.validateName(firstName, lastName)
      || userValidator.validatePassword(password, matchPassword)
      || userValidator.validateEmail(email);

    if (errors) {
      this.props.showAlert({
        type: 'error',
        text: errors,
        timeout: 8000
      });
      return;
    }

    this.props.createUser({
      firstName,
      lastName,
      email,
      password,
    });
  };

  render() {
    if (this.props.authenticated) return <Redirect to="/dashboard"/>;
    const {
      firstName, lastName, email, password, matchPassword
    } = this.state;

    let visibility = 'hidden';
    let opacity = '0';
    if (!this.props.signingIn) {
      visibility = 'visible';
      opacity = '1';
    }
    const style = {
      visibility,
      opacity,
    };

    return (
      <div className="bg bgimg-1">
        <div className="overlay">
          <div className="container signin-top">
            <div className="form-container card">
              <form method="post" id="signupForm" name="signupForm">
                <div className="form-title">
                  <span>Create Account</span>
                </div>
                <Alert/>
                <hr/>
                <div>
                  <div className="row-col-2">
                    <div>
                      <label htmlFor="first_name">
                        <b>First name</b>
                      </label>
                      <input
                        value={firstName}
                        onChange={this.updateState}
                        className="form-input"
                        id="first_name"
                        type="text"
                        placeholder="First name"
                        name="firstName"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name">
                        <b>Last name</b>
                      </label>
                      <input
                        value={lastName}
                        onChange={this.updateState}
                        className="form-input"
                        id="last_name"
                        type="text"
                        placeholder="Last name"
                        name="lastName"
                        required
                      />
                    </div>
                  </div>
                  <label htmlFor="email">
                    <b>Email</b>
                  </label>
                  <input
                    value={email}
                    onChange={this.updateState}
                    className="form-input"
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                    required
                  />
                  <label htmlFor="password">
                    <b>Password</b>
                  </label>
                  <input
                    value={password}
                    onChange={this.updateState}
                    className="form-input"
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    required
                  />
                  <label htmlFor="match-password">
                    <b>Confirm Password</b>
                  </label>
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
                  <hr/>
                  <button type="button" className="btn fit" onClick={this.createUser}>
                    <span style={style}>Register</span>
                    {this.props.signingIn && <ButtonLoader/>}
                  </button>
                </div>
                <div className="form-footer">
                  <p>
                    Already have an account?
                    {' '}
                    <Link to="/signin">Sign in</Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  signingIn: state.loading.signingIn,
  authenticated: state.authenticate.authenticated,
});

SignupPage.propTypes = {
  createUser: PropTypes.func.isRequired,
  fixFooter: PropTypes.func.isRequired,
  hideNavBar: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
  signingIn: PropTypes.bool,
};

SignupPage.defaultProps = {
  authenticated: false,
  signingIn: false,
};
export default withRouter(
  connect(
    mapStateToProps,
    {
      createUser: createAccount,
      hideNavBar,
      fixFooter,
      showAlert
    },
  )(SignupPage),
);
