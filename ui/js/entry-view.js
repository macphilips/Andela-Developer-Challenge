function CreateEntryView(model, action) {
  this._viewElement = document.createElement('div');
  this._viewElement.innerHTML = createEntryTemplate.trim();
  const textArea = this._viewElement.querySelector('textarea');
  this.buttonClicked = new Event(this);
  this.model = model;// Object.assign({}, model);

  const config = { title: 'Create New Diary Entry' };
  this.mode = action || 'create';
  if (this.mode === 'view') {
    textArea.setAttribute('readonly', 'readonly');
    config.title = 'View Diary Entry';
    this.hideActionButton();
  } else if (this.mode === 'edit') {
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
    const cancelButton = this._viewElement.querySelector('[tc-data-action="cancel"]');
    const self = this;
    okButton.onclick = () => {
      const content = self._viewElement.querySelector('textarea').value;
      if (self.mode === 'edit') {
        self.model.content = content;
        put(getEntryUrlByID(self.model.id), self.model).then((res) => {
          self.buttonClicked.notify(res);
        }, (err) => {
          showAlert(`Unable to update entry <br>${err.message}`, 'error');
        });
      } else if (self.mode === 'create') {
        post(entriesEndpoint, { content }).then((res) => {
          self.buttonClicked.notify(res);
        }, (err) => {
          showAlert(`Unable to save entry <br>${err.message}`, 'error');
        });
      } else {
        self.buttonClicked.notify();
      }
    };
  },
  getViewElement() {
    return this._viewElement;
  },
};
