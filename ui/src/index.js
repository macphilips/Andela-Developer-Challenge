import navBarView from './navbarView';
import { DOMDoc, gotoUrl, htmlToElement } from './util';
import { homeTemplate } from './templates';
import account from './account';
import Event from './event';

export default class HomePage {
  constructor() {
    this.viewElement = null;
    this.onReady = new Event(this);
  }

  render() {
    const view = DOMDoc.getElementById('main');
    if (view) view.appendChild(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }

  initialize() {
    account.identify()
      .then(() => {
        this.onReady.notify({});
        gotoUrl('#/dashboard');
      })
      .catch(() => {
        this.viewElement = htmlToElement(homeTemplate);
        navBarView.render(this.viewElement);
        this.onReady.notify({});
      });
  }
}
