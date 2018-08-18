import { DOMDoc, htmlToElement } from '../utils/index';
import { footerTemplate } from '../utils/templates';

export default class FooterViewService {
  constructor() {
    this.viewElement = null;
    this.childView = htmlToElement(footerTemplate);
  }

  render(element) {
    if (element) this.viewElement = element.querySelector('#footer');
    else this.viewElement = DOMDoc.getElementById('footer');
    if (this.viewElement) this.viewElement.appendChild(this.childView);
  }

  initialize() {
    this.render();
  }

  getViewElement() {
    return this.childView;
  }
}
