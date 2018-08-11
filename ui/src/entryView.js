import { bindPropertiesToElement, showToast, trimDate } from './util';
import { createEntryTemplate, viewEntryTemplate } from './templates';
import Event from './event';
import { entriesEndpoint, getEntryUrlByID } from './endpointUrl';
import http from './fetchWrapper';
import { getTimeString } from '../../server/src/utils';


export default class CreateEntryView {
  constructor(model, action) {
    this.mode = action || 'create';
    this.viewElement = document.createElement('div');
    this.viewElement.innerHTML = (this.mode === 'view') ? viewEntryTemplate.trim() : createEntryTemplate.trim();
    this.buttonClicked = new Event(this);
    this.model = model;
    // const header = this.viewElement.querySelector('#modal-header-title');
    // const titleInput = header.querySelector('input');
    // const titleSpan = header.querySelector('span');
    this.prepareView();
    this.buttonClickHandler();
  }

  prepareView() {
    const data = { ...this.model };
    const lastModified = (data && data.lastModified)
      ? data.lastModified : getTimeString(new Date());
    data.lastModified = trimDate(lastModified);
    const dataModelElements = this.viewElement.querySelectorAll('[tc-data-model]');
    bindPropertiesToElement(dataModelElements, data);

    if (this.mode !== 'view') {
      const textArea = this.viewElement.querySelector('textarea');
      textArea.value = (data && data.content) ? data.content : '';
      textArea.focus();
    } else {
      const viewEntry = this.viewElement.querySelector('.content-container');
      const { content } = data;
      const split = content.split(/[\r\n]+/);
      for (let i = 0; i < split.length; i += 1) {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = split[i];
        viewEntry.appendChild(paragraph);
      }
    }
  }

  static splitByNewLine(content) {
    const textSplit = [];
    let start = 0;
    for (let i = 0; i < content.length - 1; i += 1) {
      if (content.charCodeAt(i) === 10 && content.charCodeAt(i + 1) === 10) {
        const subStr = content.substring(start, i).trim();
        start = i + 1;
        textSplit.push(subStr);
      }
    }
    textSplit.push(content.substring(start).trim());
    return textSplit;
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
    // const self = this;
    if (okButton) {
      okButton.onclick = () => {
        const content = this.viewElement.querySelector('textarea').value;
        const title = this.viewElement.querySelector('[tc-data-model="title"]').value;
        if (this.mode === 'edit') {
          const data = { ...this.model };
          data.content = content;
          data.title = title;
          this.consumeApiResult(http.put(getEntryUrlByID(this.model.id), data), true);
        } else if (this.mode === 'create') {
          this.consumeApiResult(http.post(entriesEndpoint, { content, title }), false);
        } else {
          this.buttonClicked.notify();
        }
      };
    }
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
