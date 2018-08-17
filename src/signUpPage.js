import {
  getFormFieldsAsObject, gotoUrl, matchPassword, showAlert, showLoadingAnim, validateForm,
} from './utils';
import { signUpPageTemplate } from './utils/templates';
import { apiRequest } from './services';
import BasePage from './basePage';

export default class SignUpPage extends BasePage {
  constructor() {
    super(signUpPageTemplate);
  }

  registerPageEvent() {
    const signUpForm = this.viewElement.querySelector('#signupForm');
    const createAccount = () => {
      const button = signUpForm.querySelector('.btn');
      if (validateForm(signUpForm) && matchPassword(signUpForm)) {
        showLoadingAnim(button, 'show');
        const data = getFormFieldsAsObject(signUpForm);
        apiRequest.createUser(data).then(() => {
          gotoUrl('#/dashboard');
        }).catch((err) => {
          const { message } = err;
          showAlert(`Registration Failed:<br>${message}`, 'error');
        }).finally(() => {
          showLoadingAnim(button, 'remove');
        });
      }
    };
    if (signUpForm) {
      const btn = signUpForm.querySelector('.btn');
      btn.onclick = createAccount;
    }
  }
}
