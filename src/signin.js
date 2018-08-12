import { getFieldsAsObject, showAlert } from './util';
import { authenticationEndpoint, registrationEndpoint } from './endpointUrl';
import http from './fetchWrapper';

function validateForm(form) {
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

function matchPassword(form) {
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

function createAccount(e) {
  e.preventDefault();
  const form = document.getElementById('signupForm');
  if (validateForm(form) && matchPassword(form)) {
    const data = getFieldsAsObject(form);
    http.post(registrationEndpoint, data).then(() => {
      showAlert('Successful', 'success');
      location.replace('dashboard.html');
    }, (err) => {
      const { message } = err;
      showAlert(`Registration Failed:<br>${message}`, 'error');
    });
  }
}

function signIn(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('signinForm');
  if (validateForm(form)) {
    const data = getFieldsAsObject(form);
    http.post(authenticationEndpoint, data).then((res) => {
      localStorage.authenticationToken = res.token;
      window.location.replace('dashboard.html');
    }, (error) => {
      showAlert('Authentication Failed, check email or password', 'error');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.onsubmit = signIn;
  }
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.onsubmit = createAccount;
  }
});
