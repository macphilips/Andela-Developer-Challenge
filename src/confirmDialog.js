import { bindPropertiesToElement } from './util';
import { deleteDialogTemple } from './templates';
import Event from './event';
import http from './fetchWrapper';
import { getEntryUrlByID } from './endpointUrl';

export default class ConfirmDeleteEntryView {
  constructor(model) {
    this.vieewElement = document.createElement('div');
    this.vieewElement.innerHTML = deleteDialogTemple.trim();
    this.actionButtonClicked = new Event(this);

    this.model = model;
    const dataModelElements = this.vieewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements,
      { message: `This action delete <strong>${model.title}</strong> from database. Are you sure you want to continue?` });

    const okButton = this.vieewElement.querySelector('[tc-data-action="ok"]');
    const cancelButton = this.vieewElement.querySelector('[tc-data-dismiss="cancel"]');
    const self = this;
    okButton.onclick = () => {
      http.delete(getEntryUrlByID(this.model.id))
        .then(() => {
          this.notifyObserver('success');
        })
        .catch(() => this.notifyObserver('failed'));
    };
    cancelButton.onclick = () => {
      self.actionButtonClicked.notify({ action: 'cancel' });
    };
  }

  notifyObserver(status) {
    this.actionButtonClicked.notify({ status, action: 'ok' });
    if (this.modalView) {
      this.modalView.dismiss();
    }
  }

  getViewElement() {
    return this.vieewElement;
  }
}
