import { bindPropertiesToElement, DOMDoc, htmlToElement } from '../utils';
import { timeSwitcherTemplate } from '../utils/templates';

export default class TimeSwitcher {
  /**
   *
   * @param value {number}
   * @returns {number}
   * @private
   */
  static padValue(value) {
    let result = Number(value);
    if (result >= 0 && result < 10) {
      result = `0${result}`;
    }
    return result;
  }

  /**
   *
   * @param value {number}
   * @param min {number}
   * @param max {number}
   * @returns {number}
   * @private
   */
  static roundTime(value, min, max) {
    let result = value;
    if (result < min) {
      result = min;
    } else if (result > max) {
      result = max;
    }
    return result;
  }

  /**
   *
   * @param e Event
   * @private
   */
  static inputChangeHandler(e) {
    const element = e.target;
    const unit = element.getAttribute('data-unit');
    let { value } = element;
    if (unit && unit === 'hours') {
      value = TimeSwitcher.roundTime(value, 0, 23);
    } else if (unit && unit === 'minutes') {
      value = TimeSwitcher.roundTime(value, 0, 59);
    }
    element.value = parseInt(value, 10);
  }

  /**
   *
   * @param e
   * @private
   */
  static blurHandler(e) {
    const element = e.target;
    const { value } = element;
    element.value = TimeSwitcher.padValue(value);
  }

  /**
   *
   * @param direction {string}
   * @param value {number}
   * @returns {number}
   * @private
   */
  static stepMinutesValue(direction, value) {
    let result = 0;
    const minuteStep = 15;
    if (!direction) return result;

    if (direction === 'up') {
      result = (value % minuteStep === 0)
        ? value + minuteStep : minuteStep * (parseInt(`${value / minuteStep}`, 10) + 1);
    } else if (direction === 'down') {
      const round = (value === 0) ? 60 : value;
      result = (value % minuteStep === 0)
        ? value - minuteStep : minuteStep * (parseInt(`${round / minuteStep}`, 10));
    }
    return result;
  }

  /**
   *
   * @param value
   * @returns {*}
   */
  static roundAndPadValue(value) {
    let result = value;
    if (value < 0) {
      result = 23;
    } else if (value > 23) {
      result = '00';
    } else {
      result = TimeSwitcher.padValue(value);
    }
    return result;
  }

  constructor() {
    this.viewElement = null;
    this.childView = htmlToElement(timeSwitcherTemplate);
  }

  getFocusedElement() {
    const minutesInput = this.viewElement.querySelector('#minutes');
    let focused = this.viewElement.querySelector('.hasFocus');
    if (!focused) {
      minutesInput.focus();
      focused = minutesInput;
      // focused.setSelectionRange(0, focused.value.length);
    }
    return focused;
  }

  minutesControlHandler(targetElement) {
    const hoursInput = this.viewElement.querySelector('#hours');
    const focused = this.getFocusedElement();
    const direction = targetElement.getAttribute('data-direction');

    const result = TimeSwitcher.stepMinutesValue(direction, Number(focused.value));
    let hourValue = Number(hoursInput.value);

    if (result <= 0) {
      focused.value = 59;
      hourValue -= 1;
      hoursInput.value = TimeSwitcher.roundAndPadValue(hourValue);
    } else if (result >= 60) {
      focused.value = '00';
      hourValue += 1;
      hoursInput.value = TimeSwitcher.roundAndPadValue(hourValue);
    } else {
      focused.value = TimeSwitcher.padValue(result);
    }
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
    focused.value = TimeSwitcher.roundAndPadValue(hourValue);
  }

  render(element, time) {
    if (element) this.viewElement = element.querySelector('#timeSwitcher');
    else this.viewElement = DOMDoc.getElementById('timeSwitcher');
    if (!this.viewElement) return;
    const timeDataModelElements = this.childView.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(timeDataModelElements, time);
    this.viewElement.innerHTML = '';
    this.viewElement.appendChild(this.childView);
  }

  focusHandler() {
    return (e) => {
      const hoursInput = this.childView.querySelector('#hours');
      const minutesInput = this.childView.querySelector('#minutes');
      const element = e.target;
      minutesInput.classList.remove('hasFocus');
      hoursInput.classList.remove('hasFocus');
      element.classList.add('hasFocus');
    };
  }

  controlHandler() {
    return (e) => {
      const element = e.target;
      const focused = this.getFocusedElement();
      if (focused.id === 'minutes') {
        this.minutesControlHandler(element);
      } else if (focused.id === 'hours') {
        this.hoursControlHandler(element);
      }
    };
  }

  initialize() {
    const hoursInput = this.childView.querySelector('#hours');
    const minutesInput = this.childView.querySelector('#minutes');

    hoursInput.onkeyup = TimeSwitcher.inputChangeHandler;
    hoursInput.onchange = TimeSwitcher.inputChangeHandler;
    hoursInput.onpaste = TimeSwitcher.inputChangeHandler;
    hoursInput.oncut = TimeSwitcher.inputChangeHandler;

    minutesInput.onkeyup = TimeSwitcher.inputChangeHandler;
    minutesInput.onchange = TimeSwitcher.inputChangeHandler;
    minutesInput.onpaste = TimeSwitcher.inputChangeHandler;
    minutesInput.oncut = TimeSwitcher.inputChangeHandler;

    hoursInput.onblur = TimeSwitcher.blurHandler;
    minutesInput.onblur = TimeSwitcher.blurHandler;
    hoursInput.onfocus = this.focusHandler();
    minutesInput.onfocus = this.focusHandler();
    const controlButtons = this.childView.querySelectorAll('.time-controller-btn');
    for (let i = 0; i < controlButtons.length; i += 1) {
      controlButtons[i].onclick = this.controlHandler();
    }
  }
}
