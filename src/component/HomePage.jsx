import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { fixFooter } from '../actions/toolbar';

export class HomePage extends Component {
  componentDidMount() {
    this.props.fixFooter(true);
  }

  componentWillUnmount() {
    this.props.fixFooter(false);
  }

  render() {
    if (this.props.authenticated) {
      return (
        <Redirect to={{ pathname: '/dashboard' }} />
      );
    }
    return (
      <div className="bg bgimg navbar-top-padding fade-in">
        <div className="overlay">
          <div className="about left">
            <h1>MyDiary</h1>
            <p>
              { 'MyDiary is an online personal journal where users can pen down their thoughts and '
            + 'feelings, it\'s simple and convenient in use.'}
            </p>
            <div>
              <Link to="/signup">
                <span className="btn get-started">
                Get Started
                </span>
              </Link>
            </div>
            <div className="show-on-mobile">
              <Link to="/signin">
                <span className="bbtn signin">
                Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated,
});

HomePage.propTypes = {
  fixFooter: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
};

HomePage.defaultProps = {
  authenticated: false,
};
export default withRouter(connect(mapStateToProps, { fixFooter })(HomePage));
