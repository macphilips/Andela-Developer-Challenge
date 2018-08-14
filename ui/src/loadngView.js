import { htmlToElement } from './util';
import { loadingTemplate } from './templates';


export default class LoadingView {
  constructor() {
    this.childView = htmlToElement(loadingTemplate);
  }

  getViewElement() {
    return this.childView;
  }
}
