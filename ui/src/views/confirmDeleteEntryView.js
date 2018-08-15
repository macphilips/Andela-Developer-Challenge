import { bindPropertiesToElement, DOMDoc } from '../utils/util';
import { deleteDialogTemple } from '../utils/templates';
import Event from '../utils/event';
import { apiRequest } from '../services';

export default class ConfirmDeleteEntryView {
  constructor(model) {
    this.childView = DOMDoc.createElement('div');
    this.childView.innerHTML = deleteDialogTemple.trim();
    this.actionButtonClicked = new Event(this);

    this.model = model;
    const dataModelElements = this.childView.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements,
      { message: `This action delete <strong>${model.title}</strong> from database. Are you sure you want to continue?` });

    const okButton = this.childView.querySelector('[tc-data-action="ok"]');
    const cancelButton = this.childView.querySelector('[tc-data-dismiss="cancel"]');
    const self = this;
    okButton.onclick = () => {
      apiRequest.deleteEntry(this.model.id)
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
    return this.childView;
  }
}
