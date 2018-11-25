import { Redirect, Route } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import saveReferrer from './actions/redirect';

class PrivateRoute extends Component {
  render() {
    const {
      component: Components, isAuthenticated, saveReferrer: save, ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={(props) => {
          if (isAuthenticated) {
            return (
              <Components {...props} />
            );
          }
          save(props.location.pathname);
          return (
            <Redirect
              to={{
                pathname: '/signin',
                state: { from: props.location },
              }}
            />
          );
        }
        }
      />
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.any,
  isAuthenticated: PropTypes.bool,
  saveReferrer: PropTypes.func,
};
const mapStateToProps = state => ({
  isAuthenticated: state.authenticate.authenticated,
});

export default connect(mapStateToProps, { saveReferrer })(PrivateRoute);
