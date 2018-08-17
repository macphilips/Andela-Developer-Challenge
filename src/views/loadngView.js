import { htmlToElement } from '../utils';
import { loadingTemplate } from '../utils/templates';


export default class LoadingView {
  constructor() {
    this.childView = htmlToElement(loadingTemplate);
  }

  getViewElement() {
    return this.childView;
  }
}
