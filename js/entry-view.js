function CreateEntryView(model, action) {
  this._viewElement = document.createElement('div');
  this._viewElement.innerHTML = createEntryTemplate.trim();
  const textArea = this._viewElement.querySelector('textarea');

  let config = { title: 'Create New Diary Entry' },
    mode = action || 'create';
  if (mode === 'view') {
    textArea.setAttribute('readonly', 'readonly');
    config.title = 'View Diary Entry';
    this.hideActionButton();
  } else if (mode === 'edit') {
    config.title = 'Edit Diary Entry';
  }

  const dataModelElements = this._viewElement.querySelectorAll('[tc-data-model]');
  bindPropertiesToElement(dataModelElements, config);
  textArea.value = (model && model.content) ? model.content : '';
  textArea.focus();
  this.buttonClickHandler();
}

CreateEntryView.prototype = {
  hideActionButton() {
    const footer = this._viewElement.querySelector('.modal-footer');
    footer.style.opacity = 0;
    footer.style.visibility = 'hidden';
  },
  buttonClickHandler() {
    const okButton = this._viewElement.querySelector('[tc-data-action="save"]');
    const self = this;
    okButton.onclick = () => {
      // todo delete model from server
      if (self.resultCallback) {

      }
      if (self.modalView) {
        self.modalView.dismiss();
      }
    };
  },
  getViewElement() {
    return this._viewElement;
  },
};
