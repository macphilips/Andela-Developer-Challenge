import { DOMDoc, gotoUrl, htmlToElement } from './utils';
import { homeTemplate } from './utils/templates';
import Event from './utils/event';

export default class HomePage {
  constructor(account, footerViewService, navBarViewService) {
    this.viewElement = null;
    this.onReady = new Event(this);
    this.account = account;
    this.footerViewService = footerViewService;
    this.navBarViewService = navBarViewService;
  }

  render() {
    const view = DOMDoc.getElementById('main');
    if (view) view.appendChild(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }

  initialize() {
    this.account.identify()
      .then(() => {
        this.onReady.notify({});
        gotoUrl('#/dashboard');
      })
      .catch(() => {
        this.viewElement = htmlToElement(homeTemplate);
        this.navBarViewService.render(this.viewElement);
        this.footerViewService.render(this.viewElement);
        this.onReady.notify({});
      });
  }
}
