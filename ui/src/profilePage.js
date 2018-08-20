import {
  bindPropertiesToElement,
  DOMDoc,
  getFormFieldsAsObject,
  htmlToElement,
  showLoadingAnim,
  showToast,
  trimDate,
} from './utils';
import { profilePageTemplate } from './utils/templates';
import Event from './utils/event';
import TimeSwitcher from './views/timeSwitcher';

export default class ProfilePage {
  /**
   *
   * @param promise{Promise<any>}
   * @param button
   * @private
   */
  consumeAPIResult(promise, button) {
    if (button) showLoadingAnim(button, 'show');
    promise.then((result) => {
      showToast({ title: result.message }, 'success');
      this.account.identify(true).then();
    }).catch((err) => {
      showToast({ title: err.message }, 'error');
      // printError(err);
    }).finally(() => {
      if (button) showLoadingAnim(button, 'remove');
    });
  }

  /**
   *
   * @param account {UserAccount}
   * @param apiRequest {ApiRequestService}
   * @param footerViewService {FooterViewService}
   * @param navBarViewService {NavBarViewService}
   * @param notificationService {NotificationSettings}
   */
  constructor(account, apiRequest, footerViewService, navBarViewService, notificationService) {
    this.account = account;
    this.apiRequest = apiRequest;
    this.footerViewService = footerViewService;
    this.navBarViewService = navBarViewService;
    this.notificationService = notificationService;
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
      const {
        time, from, to, enabled,
      } = model;
      const [hours, minutes] = time.split(':');
      const data = {
        hours, minutes, from, to, enabled,
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
        this.consumeAPIResult(this.apiRequest.changePassword(data), changePasswordForm.querySelector('.btn'));
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
      this.consumeAPIResult(this.apiRequest.updateReminder(data), reminderForm.querySelector('.btn'));
      if (data.enabled) {
        this.notificationService.requestPermission();
      } else {
        this.notificationService.deleteToken().then();
      }
    };
  }

  updateProfileHandler() {
    return (e) => {
      e.preventDefault();
      const updateProfileForm = this.viewElement.querySelector('#updateProfile');
      const data = getFormFieldsAsObject(updateProfileForm);
      this.consumeAPIResult(this.apiRequest.updateUserDetails(data), updateProfileForm.querySelector('.btn'));
    };
  }

  registerPageEvent() {
    this.registerBtnHandler('changePassword', this.updatePasswordHandler());
    this.registerBtnHandler('reminderForm', this.updateReminderHandler());
    this.registerBtnHandler('updateProfile', this.updateProfileHandler());

    const enableNotification = this.viewElement.querySelector('[tc-data-action="enable-switch"]');
    enableNotification.onchange = () => {
      this.showReminderSettings(enableNotification.checked);
    };
  }

  /**
   *
   * @param show {boolean}
   */
  showReminderSettings(show) {
    const reminderSettingsView = this.viewElement.querySelector('.reminder-setting-js');
    if (show) {
      reminderSettingsView.classList.remove('hide-reminder-settings');
    } else {
      reminderSettingsView.classList.add('hide-reminder-settings');
    }
  }

  registerBtnHandler(formId, handler) {
    const form = this.viewElement.querySelector(`#${formId}`);
    let selector = '[tc-data-action]';
    if (formId === 'reminderForm') selector = '[tc-data-action="reminder"]';
    const btn = form.querySelector(selector);
    if (btn.nodeName === 'BUTTON') {
      btn.onclick = handler;
    }
  }

  initialize() {
    this.timeSwitchView.initialize();
    this.navBarViewService.render(this.viewElement);
    this.footerViewService.render(this.viewElement);
    this.timeSwitchView.render(this.viewElement, null);
    this.account.identify()
      .then((result) => {
        const { user, reminder, entry } = result.data;
        this.bindProfile(user);
        this.bindReminder(reminder);
        this.bindEntriesSummary(entry);
        this.registerPageEvent();
        this.showReminderSettings(reminder.enabled);
        this.onReady.notify({});
      })
      .catch((err) => {
        showToast({ title: 'Error', message: err.message }, 'error');
        // printError(err);
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
