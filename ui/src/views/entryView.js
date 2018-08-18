import {
  bindPropertiesToElement, DOMDoc, htmlToElement, showToast, trimDate,
} from '../utils';
import { createEntryTemplate, viewEntryTemplate } from '../utils/templates';
import Event from '../utils/event';
import { getTimeString } from '../../../server/src/utils/index';

export default class CreateEntryView {
  /**
   *
   * @param apiRequest
   * @param [model]
   * @param [action]
   */
  constructor(apiRequest, model, action) {
    this.apiRequest = apiRequest;
    this.mode = action || 'create';
    this.viewElement = (this.mode === 'view') ? htmlToElement(viewEntryTemplate.trim()) : htmlToElement(createEntryTemplate.trim());
    this.buttonClicked = new Event(this);
    this.model = model;
    this.prepareView();
    this.registerViewEvents();
  }

  prepareView() {
    const data = { ...this.model };
    const lastModified = (data && data.lastModified)
      ? data.lastModified : getTimeString(new Date());
    data.lastModified = trimDate(lastModified);
    this.attachDataToView(data);
  }

  attachDataToView(data) {
    const dataModelElements = this.viewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, data);
    if (this.mode !== 'view') {
      const textArea = this.viewElement.querySelector('textarea');
      textArea.value = (data && data.content) ? data.content : '';
      textArea.focus();
    } else {
      this.renderInViewMode(data);
    }
  }

  renderInViewMode(data) {
    const viewEntry = this.viewElement.querySelector('.content-container');
    const { content } = data;
    const split = content.split(/[\r\n]+/);
    for (let i = 0; i < split.length; i += 1) {
      const paragraph = DOMDoc.createElement('p');
      paragraph.innerHTML = split[i];
      viewEntry.appendChild(paragraph);
    }
  }

  registerViewEvents() {
    const okButton = this.viewElement.querySelector('[tc-data-action="save"]');
    if (okButton) {
      okButton.onclick = this.buttonClickHandler();
    }
  }

  getViewElement() {
    return this.viewElement;
  }

  consumeApiResult(promise, update) {
    promise.then((res) => {
      if (update) {
        showToast({ title: 'Entry updated' }, 'success');
      }
      this.buttonClicked.notify(res);
    }).catch((err) => {
      const title = (update) ? 'Unable to update entry' : 'Unable to save entry';
      showToast({ title, message: err.message }, 'error');
    });
  }

  buttonClickHandler() {
    return () => {
      const content = this.viewElement.querySelector('textarea').value;
      const title = this.viewElement.querySelector('[tc-data-model="title"]').value;
      if (this.mode === 'edit') {
        const data = { ...this.model };
        const { id } = data;
        data.content = content;
        data.title = title;
        this.consumeApiResult(this.apiRequest.updateEntry(id, data), true);
      } else if (this.mode === 'create') {
        this.consumeApiResult(this.apiRequest.createEntry({ content, title }), false);
      } else {
        this.buttonClicked.notify();
      }
    };
  }
}
