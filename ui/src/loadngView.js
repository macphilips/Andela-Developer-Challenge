import { htmlToElement } from './util';
import { loadingTemplate } from './templates';


export default class LoadingView {
  constructor() {
    this.vieewElement = htmlToElement(loadingTemplate);
  }

  getViewElement() {
    return this.vieewElement;
  }
}
