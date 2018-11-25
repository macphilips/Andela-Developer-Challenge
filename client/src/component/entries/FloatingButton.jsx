import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

export default class FloatingButton extends Component {
  constructor(props) {
    super(props);
    this.root = React.createRef();
  }

  handleScrollEvent = () => {
    if (!this.floatBtn) return;
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      this.floatBtn.style.transform = 'scale(1)';
    }, 250);

    this.floatBtn.style.transform = 'scale(0)';
    const screenHeight = window.innerHeight;
    const scrollPos = window.scrollY + screenHeight;
    const bodyHeight = document.body.offsetHeight;
    if (scrollPos > bodyHeight - 43) {
      this.floatBtn.style.bottom = `${scrollPos - bodyHeight + 43}px`;
    } else {
      this.floatBtn.style.bottom = '15px';
    }
  };

  componentDidMount() {
    this.floatBtn = this.root.current.querySelector('#floatBtn .floating-button ');
    this.floatBtn.style.transform = 'scale(1)';
    this.floatBtn.style.bottom = '15px';

    this.scrollTimer = null;
    document.addEventListener('scroll', this.handleScrollEvent);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollEvent);
  }

  render() {
    const { onClicked } = this.props;
    return (
      <a ref={this.root} id="floatBtn" title="Add Entry" role="button">
        <div className="floating-button show-on-mobile">
          <span onClick={onClicked} title="Add Entry" role="button" className="plus">+</span>
        </div>
      </a>
    );
  }
}

FloatingButton.propTypes = { onClicked: PropTypes.any };
