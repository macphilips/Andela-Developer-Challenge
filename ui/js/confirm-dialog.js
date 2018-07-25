function ConfirmDeleteEntryView(message) {
  this._viewElement = document.createElement('div');
  this._viewElement.innerHTML = deleteDialogTemple.trim();
  this.actionButtonClicked = new Event(this);

  const model = { message: 'This action delete entry from database. Are you sure you want to continue?' };
  if (message) {
    model.message = message;
  }

  const dataModelElements = this._viewElement.querySelectorAll('[tc-data-model]');
  bindPropertiesToElement(dataModelElements, model);

  const okButton = this._viewElement.querySelector('[tc-data-action="ok"]');
  const cancelButton = this._viewElement.querySelector('[tc-data-dismiss="cancel"]');
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

ConfirmDeleteEntryView.prototype = {
  getViewElement() {
    return this._viewElement;
  },
};
