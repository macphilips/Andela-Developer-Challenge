import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.childView = React.createRef();
  }

  handleSideNavClicked = (e) => {
    if (e.target.classList.contains('nav')) {
      return;
    }
    this.hideOrShowSideNav('hide');
  };

  handleBtnClicked = (e) => {
    const action = e.target.getAttribute('data-action');
    this.hideOrShowSideNav(action);
  };

  /**
   * Hides or Shows Navigation bar
   * @param action {'hide' | 'show'}
   * @private
   */
  hideOrShowSideNav = (action) => {
    const sideNav = this.childView.current.querySelector('.side-nav');
    const nav = sideNav.querySelector('.nav');
    if (action === 'hide') {
      sideNav.style.width = '0';
      nav.style.width = '0';
    } else {
      sideNav.style.width = '100vw';
      nav.style.width = '250px';
    }
  };

  render() {
    return (
      <div ref={this.childView} id="navbar"
           className={(this.props.hideNavBar) ? 'hide-nav-bar' : ''}>
        <div className="nav-container">
          <header className="nav-header">
            <a onClick={this.handleBtnClicked} data-action="show" className="navicon">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="19" viewBox="0 0 23 19">
                <g fill="none">
                  <g fill="#555">
                    <rect y="16" width="23" height="3" rx="1.5"/>
                    <rect width="23" height="3" rx="1.5"/>
                    <rect y="8" width="23" height="3" rx="1.5"/>
                  </g>
                </g>
              </svg>
            </a>
            <Link to="/">
              <span className="header-logo">
                <span className="logo-img"/>
              </span>
            </Link>
            <div className="nav">

              {this.props.authenticated && (
                <ul className="logged-in">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <a className="logout-js">Logout</a>
                  </li>
                </ul>
              )}
              {!this.props.authenticated && (
                <ul className="logged-out">
                  <li>
                    <Link to="/signin">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/signup">
                      <span className="btn signup">Sign Up</span>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </header>
        </div>
        <div onClick={this.handleSideNavClicked} className="side-nav">
          <div className="nav">
            <span
              onClick={this.handleBtnClicked}
              data-action="hide"
              className="action-btn close"
              role="button"
              tabIndex="0"
              aria-label="Close"
            />
            {this.props.authenticated && (
              <ul className="logged-in">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <a className="logout-js">Logout</a>
                </li>
              </ul>
            )}
            {!this.props.authenticated && (
              <ul className="logged-out">
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool,
  hideNavBar: PropTypes.bool,
};
Navbar.defaultProps = {
  authenticated: false,
  hideNavBar: false,
};


const mapStateToProps = state => ({
  hideNavBar: state.toolbar.hideNavBar,
});

Navbar.propTypes = {
  authenticated: PropTypes.bool,
  hideNavBar: PropTypes.bool,
};
Navbar.defaultProps = {
  authenticated: false,
  hideNavBar: false,
};

export default withRouter(connect(mapStateToProps, null)(Navbar));
