import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  padValue, roundAndPadValue, roundTime, stepMinutesValue
} from '../../utils/index';

export default class TimeSwitcher extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {};
    const [hours, minutes] = this.props.time.split(':');
    this.state = {
      hours,
      minutes
    };
  }

  componentDidMount() {
    this.viewElement = this.ref.current;
  }

  handleInputChange = (e) => {
    const element = e.target;
    const unit = element.getAttribute('data-unit');
    let { value } = element;
    if (unit && unit === 'hours') {
      value = roundTime(value, 0, 23);
    } else if (unit && unit === 'minutes') {
      value = roundTime(value, 0, 59);
    }
    const data = {};
    data[element.name] = parseInt(value, 10);
    this.updateState(data);
  };

  updateState(data) {
    this.setState({ ...data });
    this.props.updateTime({ ...this.state, ...data });
  }

  /**
   *
   * @param e
   * @private
   */
  blurHandler = (e) => {
    const element = e.target;
    const { value } = element;
    const data = {};
    data[element.name] = padValue(value);
    this.updateState(data);
  };

  getFocusedElement() {
    const minutesInput = this.viewElement.querySelector('#minutes');
    let focused = this.viewElement.querySelector('.hasFocus');
    if (!focused) {
      minutesInput.focus();
      focused = minutesInput;
    }
    return focused;
  }

  minutesControlHandler(targetElement) {
    const hoursInput = this.viewElement.querySelector('#hours');
    const focused = this.getFocusedElement();
    const direction = targetElement.getAttribute('data-direction');

    const result = stepMinutesValue(direction, Number(focused.value));
    let hourValue = Number(hoursInput.value);
    const data = {};
    if (result <= 0) {
      hourValue -= 1;
      data[focused.name] = 59;
      data[hoursInput.name] = roundAndPadValue(hourValue);
    } else if (result >= 60) {
      hourValue += 1;
      data[focused.name] = '00';
      data[hoursInput.name] = roundAndPadValue(hourValue);
    } else {
      data[focused.name] = padValue(result);
    }
    this.updateState(data);
  }

  hoursControlHandler(targetElement) {
    const direction = targetElement.getAttribute('data-direction');
    const focused = this.getFocusedElement();
    let hourValue = Number(focused.value);
    if (direction && direction === 'down') {
      hourValue -= 1;
    } else if (direction && direction === 'up') {
      hourValue += 1;
    }
    const data = {};
    data[focused.name] = roundAndPadValue(hourValue);
    this.updateState(data);
  }

  focusHandler = (e) => {
    const hoursInput = this.viewElement.querySelector('#hours');
    const minutesInput = this.viewElement.querySelector('#minutes');
    const element = e.target;
    minutesInput.classList.remove('hasFocus');
    hoursInput.classList.remove('hasFocus');
    element.classList.add('hasFocus');
  };

  controlHandler = (e) => {
    const element = e.target;
    const focused = this.getFocusedElement();
    if (focused.id === 'minutes') {
      this.minutesControlHandler(element);
    } else if (focused.id === 'hours') {
      this.hoursControlHandler(element);
    }
  };

  render() {
    const { hours, minutes } = this.state;
    return (
      <div ref={this.ref} className="time-spinner">
        <input
          value={hours}
          onChange={this.handleInputChange}
          onKeyUp={this.handleInputChange}
          onPaste={this.handleInputChange}
          onCut={this.handleInputChange}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          name="hours"
          data-model="hours"
          id="hours"
          type="number"
          className="time-input hours"
          data-unit="hours"
          placeholder="HH"
          autoComplete="off"
        />
        <span className="time-delimiter">:</span>
        <input
          value={minutes}
          onChange={this.handleInputChange}
          onKeyUp={this.handleInputChange}
          onPaste={this.handleInputChange}
          onCut={this.handleInputChange}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          name="minutes"
          data-model="minutes"
          id="minutes"
          type="number"
          className="time-input minutes"
          placeholder="MM"
          data-unit="minutes"
          autoComplete="off"
        />
        <div className="time-controller">
          <span onClick={this.controlHandler} className="time-controller-btn up"
                data-direction="up"/>
          <span onClick={this.controlHandler} className="time-controller-btn down"
                data-direction="down"/>
        </div>
      </div>
    );
  }
}


TimeSwitcher.propTypes = {
  time: PropTypes.string.isRequired,
  updateTime: PropTypes.func.isRequired,
};

TimeSwitcher.defaultProps = {
  minute: 0,
  hour: 0
};
