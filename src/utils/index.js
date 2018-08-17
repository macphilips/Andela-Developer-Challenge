
// eslint-disable-next-line no-undef
import { loadingButtonTemplate } from './templates';

// eslint-disable-next-line no-undef
export const DOMDoc = document;

// eslint-disable-next-line no-undef
export const windowInterface = window;

export function htmlToElement(html) {
  const template = DOMDoc.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function getValue(context, contextStr) {
  const splitArray = contextStr.split('.');
  let currentContext = context;
  while (splitArray.length) {
    const item = splitArray.shift().trim();
    if (typeof (currentContext) === 'object' && item in currentContext) {
      currentContext = currentContext[item];
    } else {
      return null;
    }
  }
  return currentContext;
}

function setElementValue(target, model) {
  const element = target;
  const data = element.getAttribute('tc-data-model');
  let value = getValue(model, data);
  if (value === 0) {
    value = '0';
  }
  if (element.nodeName === 'INPUT'
    || element.nodeName === 'SELECT'
    || element.nodeName === 'TEXTAREA') {
    element.value = value || '';
  } else {
    element.innerHTML = value;
  }
}

export function bindPropertiesToElement(dataModelElements, model) {
  if (!model) return;
  for (let i = 0; i < dataModelElements.length; i += 1) {
    setElementValue(dataModelElements[i], model);
  }
}

export function requiresSubstitution(regEx, str) {
  return regEx.test(str);
}

export function getSubstituteValue(context) {
  return (regexMatch, placeholder) => getValue(context, placeholder);
}

export function formatter(input, context) {
  const regEx = /{{([^{]*?)}}/g;
  let result = input;
  if (requiresSubstitution(regEx, input)) {
    result = input.replace(regEx, getSubstituteValue(context));
  }
  return result;
}

let timer = null;

export function stopAlertTime() {
  clearTimeout(timer);
}

/**
 * Show alert message
 * @param msg {string}
 * @param type {'success' | 'error'}
 */
export function showAlert(msg, type) {
  stopAlertTime();
  const alert = DOMDoc.getElementById('alert');
  if (!alert) return;
  alert.className = '';
  alert.classList.add('alert');
  alert.classList.add(type);
  const msgElement = alert.querySelector('.alert-msg');
  const closeElement = alert.querySelector('.close-btn');
  const closeHandler = () => {
    alert.style.display = 'none';
  };
  msgElement.innerHTML = msg;
  alert.style.display = 'block';

  closeElement.onclick = closeHandler;
  timer = setTimeout(closeHandler, 8000);
}

export function getFormFieldsAsObject(form) {
  const data = {};
  form.querySelectorAll('input').forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    data[name] = inputElement.value;
  });
  form.querySelectorAll('select').forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    data[name] = inputElement.options[inputElement.selectedIndex].value;
  });
  return data;
}

let toastTimer = null;

function stopToastTimer() {
  clearTimeout(toastTimer);
}

export function showToast(data, type) {
  stopToastTimer();
  const alert = DOMDoc.getElementById('toast');
  if (!alert) return;
  alert.className = '';
  alert.classList.add('toast');
  const msgElement = alert.querySelector('.alert-msg');
  if (data.message) {
    msgElement.style.display = 'block';
  } else {
    msgElement.style.display = 'none';
  }
  const closeElement = alert.querySelector('.close-btn');
  const closeHandler = () => {
    alert.classList.remove('show');
    alert.classList.add('dismiss');
  };
  bindPropertiesToElement(alert.querySelectorAll('[tc-data-model]'), data);
  alert.classList.add('show');
  alert.classList.remove('dismiss');
  alert.classList.add(type);

  closeElement.onclick = closeHandler;
  toastTimer = setTimeout(closeHandler, 8000);
}

export function trimDate(date) {
  if (!date) return null;
  return date.substring(0, date.length - 5).trim();
}

// eslint-disable-next-line no-undef
const storage = localStorage;

export function storeToken(token) {
  storage.authenticationToken = token;
}

export function clearToken() {
  storage.clear();
}

export function getToken() {
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (storage.authenticationToken) {
      return storage.authenticationToken;
    }
  }
  return null;
}

export function gotoUrl(url) {
// eslint-disable-next-line no-undef
  window.location.replace(url);
}

export function showLoadingAnim(btn, mode) {
  const { children } = btn;
  let visibility = 'hidden';
  let opacity = '0';
  if (mode === 'remove') {
    visibility = 'visible';
    opacity = '1';
  }
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    child.style.visibility = visibility;
    child.style.opacity = opacity;
  }

  if (mode === 'remove') {
    btn.removeChild(btn.querySelector('#loading'));
  } else {
    btn.appendChild(htmlToElement(loadingButtonTemplate));
  }
}

export function validateForm(form) {
  let valid = true;
  const inputForms = form.querySelectorAll('input');
  for (let i = inputForms.length - 1; i >= 0; i -= 1) {
    const inputForm = inputForms[i];
    let { value } = inputForm;
    if (inputForm.type !== 'password') value = value.trim();
    if (value === '') {
      inputForm.className += ' invalid';
      valid = false;
      showAlert('Input Field(s) cannot be empty', 'error');
      inputForm.focus();
      inputForm.oninput = (e) => {
        e.target.classList.remove('invalid');
      };
    }
  }
  return valid;
}

export function matchPassword(form) {
  let valid = true;
  const matchPasswordElement = form.querySelector('#match-password');
  if (matchPasswordElement) {
    const passwordElement = form.querySelector('#password');
    if (matchPasswordElement.value !== passwordElement.value) {
      showAlert('Please input a matching password', 'error');
      valid = false;
    }
  }
  return valid;
}
