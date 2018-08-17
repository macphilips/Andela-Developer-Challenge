import {
  getFieldsAsObject, gotoUrl, matchPassword, showAlert, showLoadingAnim, validateForm,
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
}
