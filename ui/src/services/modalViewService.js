import { htmlToElement, DOMDoc } from '../utils/util';
import { modalBoxTemplate } from '../utils/templates';
import Event from '../utils/event';

class ModalView {
  constructor() {
    this.childView = htmlToElement(modalBoxTemplate);
    this.onclickEvent = new Event(this);
    this.onDismissEvent = new Event(this);
    const self = this;
    this.childView.onclick = (event) => {
      self.onclickEvent.notify(event);
    };
  }

  setContent(modalContent) {
    const content = this.childView.querySelector('.modal-content');
    content.innerHTML = '';
    content.appendChild(modalContent);
    const self = this;
    const dismissButtons = this.childView.querySelectorAll('[tc-data-dismiss]');
    for (let i = 0; i < dismissButtons.length; i += 1) {
      const dismissButton = dismissButtons[i];
      dismissButton.onclick = () => {
        self.onDismissEvent.notify();
        self.dismiss();
      };
    }
  }

  getViewElement() {
    return this.childView;
  }

  dismiss() {
    this.onDismissEvent.notify();
    DOMDoc.body.removeChild(this.getViewElement());
  }
}

export default class ModalService {
  constructor() {
    this.modalVieew = new ModalView();
  }

  open(content) {
    const modalContent = content;
    const modal = this.modalVieew.getViewElement();
    modal.style.display = 'block';
    modalContent.modalView = this.modalVieew;
    this.modalVieew.setContent(modalContent.getViewElement());
    DOMDoc.body.appendChild(modal);
  }

  onDismiss(callback) {
    this.modalVieew.onDismissEvent.attach(callback);
  }

  getModalView() {
    return this.modalVieew;
  }
}
