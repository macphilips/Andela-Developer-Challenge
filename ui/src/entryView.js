import { bindPropertiesToElement, showAlert } from './util';
import { createEntryTemplate } from './templates';
import Event from './event';
import { entriesEndpoint, getEntryUrlByID } from './endpointUrl';
import http from './fetchWrapper';

export default class CreateEntryView {
  constructor(model, action) {
    this.vieewElement = document.createElement('div');
    this.vieewElement.innerHTML = createEntryTemplate.trim();
    const textArea = this.vieewElement.querySelector('textarea');
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

    const dataModelElements = this.vieewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, config);
    textArea.value = (model && model.content) ? model.content : '';
    textArea.focus();
    this.buttonClickHandler();
  }

  hideActionButton() {
    const footer = this.vieewElement.querySelector('.modal-footer');
    footer.style.opacity = 0;
    footer.style.visibility = 'hidden';
  }

  buttonClickHandler() {
    const okButton = this.vieewElement.querySelector('[tc-data-action="save"]');
    const cancelButton = this.vieewElement.querySelector('[tc-data-action="cancel"]');
    const self = this;
    okButton.onclick = () => {
      const content = self.vieewElement.querySelector('textarea').value;
      if (self.mode === 'edit') {
        self.model.content = content;
        http.put(getEntryUrlByID(self.model.id), self.model).then((res) => {
          self.buttonClicked.notify(res);
        }, (err) => {
          showAlert(`Unable to update entry <br>${err.message}`, 'error');
        });
      } else if (self.mode === 'create') {
        http.post(entriesEndpoint, { content }).then((res) => {
          self.buttonClicked.notify(res);
        }, (err) => {
          showAlert(`Unable to save entry <br>${err.message}`, 'error');
        });
      } else {
        self.buttonClicked.notify();
      }
    };
  }

  getViewElement() {
    return this.vieewElement;
  }
}
