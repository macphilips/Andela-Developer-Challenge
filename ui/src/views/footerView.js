import { DOMDoc, htmlToElement } from '../utils/util';
import { footerTemplate } from '../utils/templates';

class FooterView {
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

const footerView = new FooterView();
export default footerView;
