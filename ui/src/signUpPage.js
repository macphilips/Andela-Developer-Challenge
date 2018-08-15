import {
  getFieldsAsObject,
  gotoUrl,
  htmlToElement,
  matchPassword,
  showAlert,
  showLoadingAnim,
  validateForm,
} from './utils/util';
import { signUpPageTemplate } from './utils/templates';
import { apiRequest } from './services';

export default class SignUpPage {
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
        apiRequest.createUser(data).then(() => {
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

  getViewElement() {
    return this.viewElement;
  }
}
