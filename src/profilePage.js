import {
  bindPropertiesToElement,
  DOMDoc,
  getFormFieldsAsObject,
  htmlToElement,
  showLoadingAnim,
  showToast,
  trimDate,
} from './utils';
import navBarView from './views/navBarView';
import { account, apiRequest } from './services';
import { profilePageTemplate } from './utils/templates';
import Event from './utils/event';
import footerView from './views/footerView';
import TimeSwitcher from './views/timeSwitcher';

export default class ProfilePage {
  /**
   *
   * @param promise{Promise<any>}
   * @param button
   * @private
   */
  static consumeAPIResult(promise, button) {
    if (button) showLoadingAnim(button, 'show');
    promise.then((result) => {
      showToast({ title: result.message }, 'success');
      account.identify(true).then();
    }).catch((err) => {
      showToast({ title: err.message }, 'error');
    }).finally(() => {
      if (button) showLoadingAnim(button, 'remove');
    });
  }

  constructor() {
    this.viewElement = htmlToElement(profilePageTemplate);
    this.timeSwitchView = new TimeSwitcher();
    this.onReady = new Event(this);
  }

  bindProfile(model) {
    if (!model) return null;
    const profileSection = this.viewElement.querySelector('#profile');
    const profileDataModelElements = profileSection.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(profileDataModelElements, model);
    return profileDataModelElements;
  }

  bindEntriesSummary(model) {
    if (!model) return null;
    const data = model;
    data.lastModified = trimDate(data.lastModified);
    const entrySummary = this.viewElement.querySelector('#entrySummary');
    const entrySummaryDataModelElements = entrySummary.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(entrySummaryDataModelElements, model);
    return entrySummaryDataModelElements;
  }

  bindReminder(model) {
    if (model.time) {
      const { time, from, to } = model;
      const [hours, minutes] = time.split(':');
      const data = {
        hours, minutes, from, to,
      };
      const reminderSection = this.viewElement.querySelector('#reminder');
      const reminderDataModelElements = reminderSection.querySelectorAll('[tc-data-model]');
      bindPropertiesToElement(reminderDataModelElements, data);
      this.timeSwitchView.render(this.viewElement, data);
    }
  }

  updatePasswordHandler() {
    return (e) => {
      e.preventDefault();
      const changePasswordForm = this.viewElement.querySelector('#changePassword');
      const data = getFormFieldsAsObject(changePasswordForm);
      if (data.newPassword === data.matchPassword) {
        ProfilePage.consumeAPIResult(apiRequest.changePassword(data), changePasswordForm.querySelector('.btn'));
      } else {
        showToast({ title: 'Validation Error', message: 'Password doesn\'t match' }, 'error');
      }
    };
  }

  updateReminderHandler() {
    return (e) => {
      e.preventDefault();
      const reminderForm = this.viewElement.querySelector('#reminderForm');
      const data = getFormFieldsAsObject(reminderForm);
      data.time = `${data.hours}:${data.minutes}`;
      ProfilePage.consumeAPIResult(apiRequest.updateReminder(data), reminderForm.querySelector('.btn'));
    };
  }

  updateProfileHandler() {
    return (e) => {
      e.preventDefault();
      const updateProfileForm = this.viewElement.querySelector('#updateProfile');
      const data = getFormFieldsAsObject(updateProfileForm);
      ProfilePage.consumeAPIResult(apiRequest.updateUserDetails(data), updateProfileForm.querySelector('.btn'));
    };
  }

  registerPageEvent() {
    this.registerBtnHandler('changePassword', this.updatePasswordHandler());
    this.registerBtnHandler('reminderForm', this.updateReminderHandler());
    this.registerBtnHandler('updateProfile', this.updateProfileHandler());
  }

  registerBtnHandler(formId, handler) {
    const form = this.viewElement.querySelector(`#${formId}`);
    const btn = form.querySelector('[tc-data-action]');
    btn.onclick = handler;
  }

  initialize() {
    this.timeSwitchView.initialize();
    navBarView.render(this.viewElement);
    footerView.render(this.viewElement);
    this.timeSwitchView.render(this.viewElement, null);
    account.identify()
      .then((result) => {
        const { user, reminder, entry } = result.data;
        this.bindProfile(user);
        this.bindReminder(reminder);
        this.bindEntriesSummary(entry);
        this.registerPageEvent();
        this.onReady.notify({});
      })
      .catch((err) => {
        showToast({ title: 'Error', message: err.message }, 'error');
        this.onReady.notify({});
      });
  }

  render() {
    const view = DOMDoc.getElementById('main');
    if (view) {
      view.appendChild(this.viewElement);
      this.initialize();
    }
  }

  getViewElement() {
    return this.viewElement;
  }
}
