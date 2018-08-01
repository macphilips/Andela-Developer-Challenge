import { bindPropertiesToElement } from './util';
import { deleteDialogTemple } from './templates';
import Event from './event';

export default class ConfirmDeleteEntryView {
  constructor(message) {
    this.vieewElement = document.createElement('div');
    this.vieewElement.innerHTML = deleteDialogTemple.trim();
    this.actionButtonClicked = new Event(this);

    const model = { message: 'This action delete entry from database. Are you sure you want to continue?' };
    if (message) {
      model.message = message;
    }

    const dataModelElements = this.vieewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, model);

    const okButton = this.vieewElement.querySelector('[tc-data-action="ok"]');
    const cancelButton = this.vieewElement.querySelector('[tc-data-dismiss="cancel"]');
    const self = this;
    okButton.onclick = () => {
      // todo delete model from server
      self.actionButtonClicked.notify({ action: 'ok' });
      if (self.modalView) {
        self.modalView.dismiss();
      }
    };
    cancelButton.onclick = () => {
      self.actionButtonClicked.notify({ action: 'cancel' });
    };
  }

  getViewElement() {
    return this.vieewElement;
  }
}
