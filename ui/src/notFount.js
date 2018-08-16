import navBarView from './views/navBarView';
import { htmlToElement } from './utils/util';
import { notFoundTemplate } from './utils/templates';
import footerView from './views/footerView';

export default class PageNotFound {
  constructor() {
    this.viewElement = htmlToElement(notFoundTemplate);
  }

  initialize() {
    navBarView.render(this.viewElement);
    footerView.render(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }
}
