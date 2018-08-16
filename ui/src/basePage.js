import { htmlToElement } from './utils/util';
import footerView from './views/footerView';
import navBarView from './views/navBarView';

export default class BasePage {
  constructor(template) {
    this.template = template;
    this.viewElement = htmlToElement(template);
    navBarView.render(this.viewElement);
    footerView.render(this.viewElement);
    this.registerPageEvent();
  }

  // eslint-disable-next-line class-methods-use-this
  registerPageEvent() {
    throw new Error();
  }

  getViewElement() {
    return this.viewElement;
  }
}
