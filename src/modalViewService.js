import { htmlToElement } from './util';
import { modalBoxTemplate } from './templates';
import Event from './event';

export class ModalView {
  constructor() {
    this.vieewElement = htmlToElement(modalBoxTemplate);
    this.modalViewContent = null;
    this.onclickEvent = new Event(this);
    this.onDismissEvent = new Event(this);
    const self = this;
    this.vieewElement.onclick = (event) => {
      self.onclickEvent.notify(event);
    };
  }

  setContent(modalContent) {
    const content = this.vieewElement.querySelector('.modal-content');
    content.innerHTML = '';
    content.appendChild(modalContent);
    this.modalViewContent = modalContent;
    const self = this;
    const dismissButtons = this.vieewElement.querySelectorAll('[tc-data-dismiss]');
    for (let i = 0; i < dismissButtons.length; i += 1) {
      const dismissButton = dismissButtons[i];
      dismissButton.onclick = () => {
        self.onDismissEvent.notify();
        self.dismiss();
      };
    }
  }

  getViewElement() {
    return this.vieewElement;
  }

  dismiss() {
    this.onDismissEvent.notify();
    document.body.removeChild(this.getViewElement());
  }
}

export class ModalService {
  constructor() {
    this.modalVieew = new ModalView();
  }

  open(content) {
    const modal = this.modalVieew.getViewElement();
    modal.style.display = 'block';
    content.modalView = this.modalVieew;
    this.modalVieew.setContent(content.getViewElement());
    document.body.appendChild(modal);
  }

  onDismiss(callback) {
    this.modalVieew.onDismissEvent.attach(callback);
  }


  getModalView() {
    return this.modalVieew;
  }
}
