import { htmlToElement } from '../utils/util';
import { loadingTemplate } from '../utils/templates';


export default class LoadingView {
  constructor() {
    this.childView = htmlToElement(loadingTemplate);
  }

  getViewElement() {
    return this.childView;
  }
}
