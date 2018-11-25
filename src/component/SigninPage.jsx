/* eslint-disable react/no-unescaped-entities,react/destructuring-assignment */
import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from './notification/Alert';
import { loginUser } from '../actions/authUser';
import ButtonLoader from './ButtonLoader';
import { fixFooter, hideNavBar } from '../actions/toolbar';

import img from '../images/logo-preview.gif';
import userValidator from '../userValidator';
import { showAlert } from '../actions/notification';

export class SigninPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    this.props.hideNavBar(true);
    this.props.fixFooter(true);
  }

  componentWillUnmount() {
    this.props.hideNavBar(false);
    this.props.fixFooter(false);
  }

  onClick = () => {
    const { email, password } = this.state;
    const errors = userValidator.validateEmail(email)
      || userValidator.validatePassword(password, password);
    if (errors) {
      this.props.showAlert({
        type: 'error',
        text: errors,
        timeout: 8000
      });
      return;
    }
    this.props.login({
      email,
      password,
    });
  };

  updateState = (e) => {
    const data = {};
    data[e.target.name] = e.target.value;
    this.setState({ ...data });
  };

  render() {
    const { authenticated, redirectToReferrer } = this.props;

    if (authenticated) {
      if (redirectToReferrer && redirectToReferrer.to) {
        return <Redirect {...redirectToReferrer} />;
      }
      return <Redirect to="/dashboard"/>;
    }

    const { email, password } = this.state;
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
            <div className="card form-container signin">
              <div className="form-login-header">
                <Link to="/">
                  <img alt="my diary logo" className="logo" src={img}/>
                </Link>
              </div>
              <form method="post" id="signinForm" name="signinForm">
                <div className="form-title">
                  <span>Welcome, please sign in</span>
                </div>
                <Alert/>
                <hr/>
                <div>
                  <label htmlFor="email"><b>Username</b></label>
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

                  <label htmlFor="password"><b>Password</b></label>
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
                  <button className="btn fit" type="button" onClick={this.onClick}>
                    <span style={style}>Login</span>
                    {this.props.signingIn && <ButtonLoader/>}
                  </button>
                </div>
                <div className="form-footer">
                  <p>
                    Don't have an account?
                    <Link to="/signup">Sign up</Link>.
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div id="footer" className="fixed-bottom white"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  signingIn: state.loading.signingIn,
  authenticated: state.authenticate.authenticated,
  redirectToReferrer: state.redirect.redirectToReferrer,
});

SigninPage.propTypes = {
  login: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  fixFooter: PropTypes.func.isRequired,
  hideNavBar: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
  signingIn: PropTypes.bool,
};

SigninPage.defaultProps = {
  authenticated: false,
  signingIn: false,
};
export default withRouter(connect(mapStateToProps, {
  login: loginUser,
  showAlert,
  hideNavBar,
  fixFooter
})(SigninPage));
