import { bindPropertiesToElement, showToast } from './util';
import { createEntryTemplate } from './templates';
import Event from './event';
import { entriesEndpoint, getEntryUrlByID } from './endpointUrl';
import http from './fetchWrapper';
import { getTimeString } from '../../server/src/utils';

export default class CreateEntryView {
  constructor(model, action) {
    this.viewElement = document.createElement('div');
    this.viewElement.innerHTML = createEntryTemplate.trim();
    const textArea = this.viewElement.querySelector('textarea');
    this.buttonClicked = new Event(this);
    this.model = model;

    const header = this.viewElement.querySelector('#modal-header-title');
    const titleInput = header.querySelector('input');
    const titleSpan = header.querySelector('span');

    this.mode = action || 'create';
    if (model && this.mode === 'view') {
      titleInput.style.display = 'none';
      titleSpan.style.display = 'block';
      textArea.setAttribute('readonly', 'readonly');
      this.actionButtonVisibility('hide');
    } else {
      titleInput.style.display = 'block';
      titleSpan.style.display = 'none';
    }
    this.prepareView(model);
    this.buttonClickHandler();
  }

  prepareView(model) {
    const textArea = this.viewElement.querySelector('textarea');
    const data = { ...this.model };
    const lastModified = (data && data.lastModified)
      ? data.lastModified : getTimeString(new Date());
    data.lastModified = lastModified.substring(0, lastModified.length - 5).trim();
    const dataModelElements = this.viewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, data);
    textArea.value = (model && model.content) ? model.content : '';
    textArea.focus();
  }

  actionButtonVisibility(visibility) {
    const footer = this.viewElement.querySelector('.modal-footer');
    if (visibility === 'hide') {
      footer.style.opacity = 0;
      footer.style.visibility = 'hidden';
    } else {
      footer.style.opacity = 1;
      footer.style.visibility = 'block';
    }
  }

  buttonClickHandler() {
    const okButton = this.viewElement.querySelector('[tc-data-action="save"]');
    // const cancelButton = this.viewElement.querySelector('[tc-data-action="cancel"]');
    const self = this;
    okButton.onclick = () => {
      const content = self.viewElement.querySelector('textarea').value;
      const title = self.viewElement.querySelector('[tc-data-model="title"]').value;
      if (self.mode === 'edit') {
        const data = { ...this.model };
        data.content = content;
        data.title = title;
        this.consumeApiResult(http.put(getEntryUrlByID(self.model.id), data), true);
      } else if (self.mode === 'create') {
        this.consumeApiResult(http.post(entriesEndpoint, { content, title }), false);
      } else {
        self.buttonClicked.notify();
      }
    };
  }

  getViewElement() {
    return this.viewElement;
  }

  consumeApiResult(promise, update) {
    promise.then((res) => {
      if (update) {
        showToast('Entry updated', 'success');
      }
      this.buttonClicked.notify(res);
    }).catch((err) => {
      const message = (update) ? 'Unable to update entry' : 'Unable to save entry';
      showToast(`${message}<br>${err.message}`, 'error');
    });
  }
}
