import { entryListItemTemplate } from './templates';
import { formatter, getValue, htmlToElement } from './util';
import Event from './event';

export default class EntryRowView {
  constructor(model) {
    const self = this;
    let html = `${entryListItemTemplate.trim()}`;
    html = formatter(html, model);
    this.view = htmlToElement(html);
    this.model = model;
    this.clickAction = new Event(this);
    // this.checkBoxChange = new Event(this);
    this.updateView();
    // Update view when model changes
    this.model.valueChangeObserver.attach(() => {
      self.updateView();
    });
    this.registerDropDownItemClick();
    this.handleViewClick();
  }

  handleViewClick() {
    this.view.onclick = (e) => {
      const targetElement = e.target;
      if (targetElement.classList.contains('dropdown-toggle')) {
        return null;
      }
      const attrData = targetElement.getAttribute('tc-data-action');
      if (attrData) {
        return null;
      }
      return this.clickAction.notify({ action: 'view', model: this.model });
    };
  }

  registerDropDownItemClick() {
    // const self = this;
    // Dispatch onclick event when dropdown item is selected
    const dataActionElements = this.view.querySelectorAll('[tc-data-action]');
    for (let i = 0; i < dataActionElements.length; i += 1) {
      // (function () {
      const dataActionElement = dataActionElements[i];
      const dataValue = dataActionElement.getAttribute('tc-data-action');

      if (dataValue === 'view' || dataValue === 'edit' || dataValue === 'delete') {
        dataActionElement.onclick = () => {
          this.clickAction.notify({ action: dataValue, model: this.model });
          this.dismissDropDownMenu();
        };
      }
      // }());
    }
    // Show dropdown
    const toggleAction = this.view.querySelector('[tc-data-action="dropdown-toggle"]');
    toggleAction.onclick = (e) => {
      this.showDropDownMenu(e);
    };
  }

  getModel() {
    return this.model;
  }

  setPosition(position) {
    const indexes = this.view.querySelectorAll('[data-index]');
    for (let i = 0; i < indexes.length; i += 1) {
      const index = indexes[i];
      index.setAttribute('data-index', position);
    }
  }

  getViewElement() {
    return this.view;
  }

  updateView() {
    const dataModelElements = this.view.querySelectorAll('[tc-data-model]');
    let i;
    for (i = 0; i < dataModelElements.length; i += 1) {
      const element = dataModelElements[i];
      const data = element.getAttribute('tc-data-model');
      element.innerHTML = getValue(this.model, data);
    }
  }

  showDropDownMenu(e) {
    // const self = this;
    this.dismissDropDownMenu();
    e.toElement.nextElementSibling.classList.toggle('open');
    window.onclick = (event) => {
      if (!event.target.matches('.dropdown-toggle-icon')) {
        this.dismissDropDownMenu();
      }
    };
  }

  dismissDropDownMenu() {
    const dropdownMenus = document.getElementsByClassName('dropdown-menu');
    for (let i = 0; i < dropdownMenus.length; i += 1) {
      const openDropdown = dropdownMenus[i];
      if (openDropdown.classList.contains('open')) {
        openDropdown.classList.remove('open');
      }
    }
  }

  selectCheckBoxState(state) {
    const checkbox = this.view.querySelector('[tc-data-action="check"]');
    checkbox.checked = state;
  }
}
