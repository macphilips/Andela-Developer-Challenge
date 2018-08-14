import {
  DOMDoc, getFieldsAsObject, gotoUrl, htmlToElement, showAlert, showLoadingAnim,
} from './util';
import { registrationEndpoint } from './endpointUrl';
import http from './fetchWrapper';
import { signInPageTemplate, signUpPageTemplate } from './templates';
import loginService from './loginService';

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

export class SignUpPage {
  constructor() {
    this.signUpPageTemplate = signUpPageTemplate;
    this.viewElement = htmlToElement(this.signUpPageTemplate);
    this.registerSignUpEvent();
  }

  registerSignUpEvent() {
    const signUpForm = this.viewElement.querySelector('#signupForm');
    const createAccount = () => {
      const button = signUpForm.querySelector('.btn');
      if (validateForm(signUpForm) && matchPassword(signUpForm)) {
        showLoadingAnim(button, 'show');
        const data = getFieldsAsObject(signUpForm);
        http.post(registrationEndpoint, data).then(() => {
          showLoadingAnim(button, 'remove');
          gotoUrl('#/dashboard');
        }).catch((err) => {
          const { message } = err;
          showLoadingAnim(button, 'remove');
          showAlert(`Registration Failed:<br>${message}`, 'error');
        });
      }
    };
    if (signUpForm) {
      const btn = signUpForm.querySelector('.btn');
      btn.onclick = createAccount;
    }
  }

  render() {
    const view = DOMDoc.getElementById('main1');
    if (view) view.appendChild(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }
}

export class SignInPage {
  constructor() {
    this.signInPageTemplate = signInPageTemplate;
    this.viewElement = htmlToElement(this.signInPageTemplate);
    this.registerSignInEvent();
  }

  registerSignInEvent() {
    const signInForm = this.viewElement.querySelector('#signinForm');
    const signIn = () => {
      const button = signInForm.querySelector('.btn');
      if (validateForm(signInForm)) {
        showLoadingAnim(button, 'show');
        const data = getFieldsAsObject(signInForm);
        loginService.login(data).then(() => {
          // storeToken(res.token);
          showLoadingAnim(button, 'remove');
          gotoUrl('#/dashboard');
        }).catch(() => {
          showLoadingAnim(button, 'remove');
          showAlert('Authentication Failed, check email or password', 'error');
        });
      }
    };
    if (signInForm) {
      const btn = signInForm.querySelector('.btn');
      btn.onclick = signIn;
    }
  }

  render() {
    const view = DOMDoc.getElementById('main');
    if (view) view.appendChild(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }
}
