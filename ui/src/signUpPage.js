import {
  getFormFieldsAsObject, gotoUrl, matchPassword, showAlert, showLoadingAnim, validateForm,
} from './utils';
import { signUpPageTemplate } from './utils/templates';
import BasePage from './basePage';

export default class SignUpPage extends BasePage {
  /**
   *
   * @param apiRequest {ApiRequestService}
   * @param footerViewService {FooterViewService}
   * @param navBarViewService {NavBarViewService}
   */
  constructor(apiRequest, footerViewService, navBarViewService) {
    super(footerViewService, navBarViewService, signUpPageTemplate);
    this.apiRequest = apiRequest;
  }

  registerPageEvent() {
    const signUpForm = this.viewElement.querySelector('#signupForm');
    const createAccount = () => {
      const button = signUpForm.querySelector('.btn');
      if (validateForm(signUpForm) && matchPassword(signUpForm)) {
        showLoadingAnim(button, 'show');
        const data = getFormFieldsAsObject(signUpForm);
        this.apiRequest.createUser(data).then(() => {
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
