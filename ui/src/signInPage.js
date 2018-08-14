import {
  getFieldsAsObject, gotoUrl, htmlToElement, showAlert, showLoadingAnim, validateForm,
} from './utils/util';
import { signInPageTemplate } from './utils/templates';
import loginService from './services/loginService';

export default class SignInPage {
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

  getViewElement() {
    return this.viewElement;
  }
}
