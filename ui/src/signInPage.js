import {
  getFieldsAsObject, gotoUrl, showAlert, showLoadingAnim, validateForm,
} from './utils';
import { signInPageTemplate } from './utils/templates';
import { loginService } from './services';
import BasePage from './basePage';

export default class SignInPage extends BasePage {
  constructor() {
    super(signInPageTemplate);
  }

  registerPageEvent() {
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
}
