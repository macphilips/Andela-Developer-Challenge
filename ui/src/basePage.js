import { htmlToElement } from './utils';

export default class BasePage {
  constructor(footerViewService, navBarViewService, template) {
    this.template = template;
    this.viewElement = htmlToElement(template);
    navBarViewService.render(this.viewElement);
    footerViewService.render(this.viewElement);
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
