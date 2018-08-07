import { getValue, getFieldsAsObject, showToast } from './util';
import { changePassword, reminder, userProfile } from './endpointUrl';
import NavBarView from './navbarView';
import http from './fetchWrapper';

// let user;

function padValue(value) {
  let result = Number(value);
  if (result >= 0 && result < 10) {
    result = `0${result}`;
  }
  return result;
}

function roundHours(value) {
  let result = value;
  if (result < 0) {
    result = 0;
  } else if (result > 23) {
    result = 23;
  }
  return result;
}


function roundMinutes(value) {
  let result = value;
  if (result < 0) {
    result = 0;
  } else if (result > 59) {
    result = 59;
  }
  return result;
}

function inputChangeHandler(e) {
  const element = e.target;
  const unit = element.getAttribute('data-unit');
  let { value } = element;
  if (unit && unit === 'hours') {
    value = roundHours(value);
  } else if (unit && unit === 'minutes') {
    value = roundMinutes(value);
  }
  element.value = parseInt(value, 10);
}

function focusHandler(e) {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const element = e.target;
  minutesInput.classList.remove('hasFocus');
  hoursInput.classList.remove('hasFocus');
  element.classList.add('hasFocus');
}

function blurHandler(e) {
  const element = e.target;
  // element.classList.remove('hasFocus');
  const { value } = element;
  element.value = padValue(value);
}

function getFocusedElement() {
  const minutesInput = document.getElementById('minutes');
  let focused = document.querySelector('.hasFocus');
  if (!focused) {
    minutesInput.focus();
    focused = minutesInput;
    // focused.setSelectionRange(0, focused.value.length);
  }
  return focused;
}

function stepMinutesValue(direction, value) {
  let result = 0;
  const minuteStep = 15;
  if (direction && direction === 'up') {
    result = (value % minuteStep === 0)
      ? value + minuteStep : minuteStep * (parseInt(value / minuteStep, 10) + 1);
  } else if (direction && direction === 'down') {
    const round = (value === 0) ? 60 : value;
    result = (value % minuteStep === 0)
      ? value - minuteStep : minuteStep * (parseInt(round / minuteStep, 10));
  }
  return result;
}

function roundAndPadValue(hourValue) {
  let result = hourValue;
  if (hourValue < 0) {
    result = 23;
  } else if (hourValue > 23) {
    result = '00';
  } else {
    result = padValue(hourValue);
  }
  return result;
}

function minutesControlHandler(targetElement) {
  const hoursInput = document.getElementById('hours');
  const focused = getFocusedElement();
  const direction = targetElement.getAttribute('data-direction');

  const result = stepMinutesValue(direction, Number(focused.value));
  let hourValue = Number(hoursInput.value);

  if (result <= 0) {
    focused.value = 59;
    hourValue -= 1;
    hoursInput.value = roundAndPadValue(hourValue);
  } else if (result >= 60) {
    focused.value = '00';
    hourValue += 1;
    hoursInput.value = roundAndPadValue(hourValue);
  } else {
    focused.value = padValue(result);
  }
}

function hoursControlHandler(targetElement) {
  const direction = targetElement.getAttribute('data-direction');
  const focused = getFocusedElement();
  let hourValue = Number(focused.value);
  if (direction && direction === 'down') {
    hourValue -= 1;
  } else if (direction && direction === 'up') {
    hourValue += 1;
  }
  focused.value = roundAndPadValue(hourValue);
}

function controlHandler(e) {
  // const hoursInput = document.getElementById('hours');
  const element = e.target;
  const focused = getFocusedElement();
  // const value = Number(focused.value);
  if (focused.id === 'minutes') {
    minutesControlHandler(element);
  } else if (focused.id === 'hours') {
    hoursControlHandler(element);
  }
}

function timeInputController() {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');

  hoursInput.onkeyup = inputChangeHandler;
  hoursInput.onchange = inputChangeHandler;
  hoursInput.onpaste = inputChangeHandler;
  hoursInput.oncut = inputChangeHandler;

  minutesInput.onkeyup = inputChangeHandler;
  minutesInput.onchange = inputChangeHandler;
  minutesInput.onpaste = inputChangeHandler;
  minutesInput.oncut = inputChangeHandler;

  hoursInput.onblur = blurHandler;
  minutesInput.onblur = blurHandler;
  hoursInput.onfocus = focusHandler;
  minutesInput.onfocus = focusHandler;
  const controlButtons = document.querySelectorAll('.time-controller-btn');
  for (let i = 0; i < controlButtons.length; i += 1) {
    controlButtons[i].onclick = controlHandler;
  }
}

function bind(elements, model) {
  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    const data = element.getAttribute('tc-data-model');
    element.value = getValue(model, data);
  }
}

function bindProfile(model) {
  const profileSection = document.getElementById('profile');
  const profileDataModelElements = profileSection.querySelectorAll('[tc-data-model]');
  bind(profileDataModelElements, model);
  return profileDataModelElements;
}

function bindReminder(model) {
  if (model.reminder.time) {
    const reminderSetting = model.reminder;
    const { time, from, to } = reminderSetting;
    const [hours, minutes] = time.split(':');

    const reminderSection = document.getElementById('reminder');
    const reminderDataModelElements = reminderSection.querySelectorAll('[tc-data-model]');
    bind(reminderDataModelElements, {
      hours, minutes, from, to,
    });
  }
}

function consumeAPIResult(promise) {
  promise.then((result) => {
    showToast(result.message, 'success');
  }).catch((err) => {
    showToast(err.message, 'error');
  });
}

function updatePasswordHandler(e) {
  e.preventDefault();
  const changePasswordForm = document.getElementById('changePassword');
  const data = getFieldsAsObject(changePasswordForm);
  if (data.password === data.matchPassword) {
    consumeAPIResult(http.post(changePassword, data));
  } else {
    showToast('Password doesn\'t match', 'error');
  }
}

function updateReminderHandler(e) {
  e.preventDefault();
  const reminderForm = document.getElementById('reminderForm');
  const data = getFieldsAsObject(reminderForm);
  data.time = `${data.hours}:${data.minutes}`;
  consumeAPIResult(http.put(reminder, data));
}

function registerEvent() {
  const changePasswordForm = document.getElementById('changePassword');
  const changePasswordButton = changePasswordForm.querySelector('[tc-data-action]');
  changePasswordButton.onclick = updatePasswordHandler;

  const reminderForm = document.getElementById('reminderForm');
  const reminderButton = reminderForm.querySelector('[tc-data-action]');
  reminderButton.onclick = updateReminderHandler;
}

document.addEventListener('DOMContentLoaded', () => {
  const navbar = new NavBarView();
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (localStorage.authenticationToken) {
      navbar.render();
      timeInputController();
      http.get(userProfile)
        .then((data) => {
          const { user } = data;
          bindProfile(user);
          // registerEvent();
        })
        .catch((err) => {
          showToast(err.message, 'error');
        });
      http.get(reminder)
        .then((data) => {
          bindReminder(data);
          registerEvent();
        })
        .catch((err) => {
          showToast(err.message, 'error');
        });
    } else {
      window.location.replace('signin.html');
    }
  } else {
    // Sorry! No Web Storage support..
  }
});
