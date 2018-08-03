import {
  bindPropertiesToElement, getTimeString, showAlert, showToast,
} from './util';
import {createEntryTemplate} from './templates';
import Event from './event';
import {entriesEndpoint, getEntryUrlByID} from './endpointUrl';
import http from './fetchWrapper';

export default class CreateEntryView {
  constructor(model, action) {
    this.viewElement = document.createElement('div');
    this.viewElement.innerHTML = createEntryTemplate.trim();
    const textArea = this.viewElement.querySelector('textarea');
    this.buttonClicked = new Event(this);
    this.model = model;// Object.assign({}, model);
    const header = this.viewElement.querySelector('#modal-header-title');
    const titleInput = header.querySelector('input');
    const titleSpan = header.querySelector('span');
console.log()
    this.mode = action || 'create';
    if (model && this.mode === 'view') {
      titleInput.style.display = 'none';
      titleSpan.style.display = 'block';
      textArea.setAttribute('readonly', 'readonly');
      this.hideActionButton();
    } else {
      titleInput.style.display = 'block';
      titleSpan.style.display = 'none';
    }
    const data = {...this.model};
    console.log(data, ' => ', this.model, 'mode => ', action);
    let lastModified;
    if (data && data.lastModified) {
      lastModified = data.lastModified;
    } else {
      lastModified = getTimeString(new Date());
    }
    data.lastModified = lastModified.substring(0, lastModified.length - 5).trim();
    const dataModelElements = this.viewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, data);
    textArea.value = (model && model.content) ? model.content : '';
    textArea.focus();
    this.buttonClickHandler();
  }

  hideActionButton() {
    const footer = this.viewElement.querySelector('.modal-footer');
    footer.style.opacity = 0;
    footer.style.visibility = 'hidden';
  }

  showActionButton() {
    const footer = this.viewElement.querySelector('.modal-footer');
    footer.style.opacity = 1;
    footer.style.visibility = 'block';
  }

  buttonClickHandler() {
    const okButton = this.viewElement.querySelector('[tc-data-action="save"]');
    const cancelButton = this.viewElement.querySelector('[tc-data-action="cancel"]');
    const self = this;
    okButton.onclick = () => {
      const content = self.viewElement.querySelector('textarea').value;
      const title = self.viewElement.querySelector('[tc-data-model="title"]').value;
      if (self.mode === 'edit') {
        const data = {...this.model};
        data.content = content;
        data.title = title;
        http.put(getEntryUrlByID(self.model.id), data).then((res) => {
          console.log('Update => ', res);
          self.buttonClicked.notify(res);
          showToast('Updated Successful', 'success');
        }, (err) => {
          console.log('error => ', err.message);
          showToast(`Unable to update entry <br>${err.message}`, 'error');
        });
      } else if (self.mode === 'create') {
        http.post(entriesEndpoint, {content,title}).then((res) => {
          self.buttonClicked.notify(res);
        }, (err) => {
          showToast(`Unable to save entry <br>${err.message}`, 'error');
        });
      } else {
        self.buttonClicked.notify();
      }
    };
  }

  getViewElement() {
    return this.viewElement;
  }
}
