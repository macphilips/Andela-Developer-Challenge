import {
  bindPropertiesToElement, DOMDoc, getFieldsAsObject, htmlToElement, showToast, trimDate,
} from './utils/util';
import navBarView from './views/navBarView';
import { account, apiRequest } from './services';
import { profilePageTemplate } from './utils/templates';
import Event from './utils/event';
import footerView from './views/footerView';

export default class ProfilePage {
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
      value = ProfilePage.roundTime(value, 0, 23);
    } else if (unit && unit === 'minutes') {
      value = ProfilePage.roundTime(value, 0, 59);
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
    element.value = ProfilePage.padValue(value);
  }

  /**
   *
   * @param promise{Promise<any>}
   * @private
   */
  static consumeAPIResult(promise) {
    promise.then((result) => {
      showToast({ title: result.message }, 'success');
    }).catch((err) => {
      showToast({ title: err.message }, 'error');
    });
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
      result = ProfilePage.padValue(value);
    }
    return result;
  }

  constructor() {
    this.viewElement = htmlToElement(profilePageTemplate);
    this.onReady = new Event(this);
  }

  focusHandler() {
    return (e) => {
      const hoursInput = this.viewElement.querySelector('#hours');
      const minutesInput = this.viewElement.querySelector('#minutes');
      const element = e.target;
      minutesInput.classList.remove('hasFocus');
      hoursInput.classList.remove('hasFocus');
      element.classList.add('hasFocus');
    };
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

    const result = ProfilePage.stepMinutesValue(direction, Number(focused.value));
    let hourValue = Number(hoursInput.value);

    if (result <= 0) {
      focused.value = 59;
      hourValue -= 1;
      hoursInput.value = ProfilePage.roundAndPadValue(hourValue);
    } else if (result >= 60) {
      focused.value = '00';
      hourValue += 1;
      hoursInput.value = ProfilePage.roundAndPadValue(hourValue);
    } else {
      focused.value = ProfilePage.padValue(result);
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
    focused.value = ProfilePage.roundAndPadValue(hourValue);
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

  timeInputController() {
    const hoursInput = this.viewElement.querySelector('#hours');
    const minutesInput = this.viewElement.querySelector('#minutes');

    hoursInput.onkeyup = ProfilePage.inputChangeHandler;
    hoursInput.onchange = ProfilePage.inputChangeHandler;
    hoursInput.onpaste = ProfilePage.inputChangeHandler;
    hoursInput.oncut = ProfilePage.inputChangeHandler;

    minutesInput.onkeyup = ProfilePage.inputChangeHandler;
    minutesInput.onchange = ProfilePage.inputChangeHandler;
    minutesInput.onpaste = ProfilePage.inputChangeHandler;
    minutesInput.oncut = ProfilePage.inputChangeHandler;

    hoursInput.onblur = ProfilePage.blurHandler;
    minutesInput.onblur = ProfilePage.blurHandler;
    hoursInput.onfocus = this.focusHandler();
    minutesInput.onfocus = this.focusHandler();
    const controlButtons = this.viewElement.querySelectorAll('.time-controller-btn');
    for (let i = 0; i < controlButtons.length; i += 1) {
      controlButtons[i].onclick = this.controlHandler();
    }
  }

  bindProfile(model) {
    if (!model) return null;
    const profileSection = this.viewElement.querySelector('#profile');
    const profileDataModelElements = profileSection.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(profileDataModelElements, model);
    return profileDataModelElements;
  }

  bindEntriesSummary(model) {
    if (!model) return null;
    const data = model;
    data.lastModified = trimDate(data.lastModified);
    const entrySummary = this.viewElement.querySelector('#entrySummary');
    const entrySummaryDataModelElements = entrySummary.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(entrySummaryDataModelElements, model);
    return entrySummaryDataModelElements;
  }

  bindReminder(model) {
    if (model.time) {
      const { time, from, to } = model;
      const [hours, minutes] = time.split(':');

      const reminderSection = this.viewElement.querySelector('#reminder');
      const reminderDataModelElements = reminderSection.querySelectorAll('[tc-data-model]');
      bindPropertiesToElement(reminderDataModelElements, {
        hours, minutes, from, to,
      });
    }
  }

  updatePasswordHandler() {
    return (e) => {
      e.preventDefault();
      const changePasswordForm = this.viewElement.querySelector('#changePassword');
      const data = getFieldsAsObject(changePasswordForm);
      if (data.newPassword === data.matchPassword) {
        ProfilePage.consumeAPIResult(apiRequest.changePassword(data));
      } else {
        showToast({ title: 'Validation Error', message: 'Password doesn\'t match' }, 'error');
      }
    };
  }

  updateReminderHandler() {
    return (e) => {
      e.preventDefault();
      const reminderForm = this.viewElement.querySelector('#reminderForm');
      const data = getFieldsAsObject(reminderForm);
      data.time = `${data.hours}:${data.minutes}`;
      ProfilePage.consumeAPIResult(apiRequest.updateReminder(data));
    };
  }

  registerEvent() {
    const changePasswordForm = this.viewElement.querySelector('#changePassword');
    const changePasswordButton = changePasswordForm.querySelector('[tc-data-action]');
    changePasswordButton.onclick = this.updatePasswordHandler();

    const reminderForm = this.viewElement.querySelector('#reminderForm');
    const reminderButton = reminderForm.querySelector('[tc-data-action]');
    reminderButton.onclick = this.updateReminderHandler();
  }

  initialize() {
    navBarView.render(this.viewElement);
    footerView.render(this.viewElement);
    this.timeInputController();
    account.identify()
      .then((result) => {
        const { user, reminder, entry } = result.data;
        this.bindProfile(user);
        this.bindReminder(reminder);
        this.bindEntriesSummary(entry);
        this.registerEvent();
        this.onReady.notify({});
      })
      .catch((err) => {
        showToast({ title: 'Error', message: err.message }, 'error');
        this.onReady.notify({});
      });
  }

  render() {
    const view = DOMDoc.getElementById('main');
    if (view) {
      view.appendChild(this.viewElement);
      this.initialize();
    }
  }

  getViewElement() {
    return this.viewElement;
  }
}
