import { htmlToElement } from './utils';
import { notFoundTemplate } from './utils/templates';

export default class PageNotFound {
  constructor(footerViewService, navBarViewService) {
    this.viewElement = htmlToElement(notFoundTemplate);
    this.footerViewService = footerViewService;
    this.navBarViewService = navBarViewService;
  }

  initialize() {
    this.navBarViewService.render(this.viewElement);
    this.footerViewService.render(this.viewElement);
  }

  getViewElement() {
    return this.viewElement;
  }
}
