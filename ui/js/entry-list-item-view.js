function EntryRowView(model) {
  const self = this;
  let html = `${entryTableBodyRowTemplate.trim()}`;
  html = formatter(html, model);
  this._view = htmlToElement(html);
  this._model = model;
  this.clickAction = new Event(this);
  this.checkBoxChange = new Event(this);
  this.updateView();
  // Update view when model changes
  this._model.valueChangeObserver.attach(() => {
    self.updateView();
  });
  this.registerDropDownItemClick();
  this.registerOnCheckHandler();
}

EntryRowView.prototype = {
  registerDropDownItemClick() {
    const self = this;
    // Dispatch onclick event when dropdown item is selected
    const dataActionElements = this._view.querySelectorAll('[tc-data-action]');
    for (i = 0; i < dataActionElements.length; i++) {
      (function () {
        const dataActionElement = dataActionElements[i];
        const dataValue = dataActionElement.getAttribute('tc-data-action');
        if (dataValue === 'view' || dataValue === 'edit' || dataValue === 'delete') {
          dataActionElement.onclick = () => {
            self.clickAction.notify({ action: dataValue, model: Object.assign({}, self._model) });
            self.dismissDropDownMenu();
          };
        }
      }());
    }
    // Show dropdown
    const toggleAction = this._view.querySelector('[tc-data-action="dropdown-toggle"]');
    toggleAction.onclick = (e) => {
      self.showDropDownMenu(e);
    };
  },
  registerOnCheckHandler() {
    const self = this;
    // Dispatch onchange event when the checkbox changes
    const checkbox = this._view.querySelector('[tc-data-action="check"]');
    checkbox.onchange = (e) => {
      const index = checkbox.getAttribute('data-index');
      const id = checkbox.getAttribute('tc-data-id');
      const result = { position: index, id, checked: e.target.checked };
      self.checkBoxChange.notify(result);
    };
  },
  getModel() {
    return this._model;
  },
  setPosition(position) {
    const indexes = this._view.querySelectorAll('[data-index]');
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i];
      index.setAttribute('data-index', position);
    }
  },
  getViewElement() {
    return this._view;
  },
  updateView() {
    const dataModelElements = this._view.querySelectorAll('[tc-data-model]');
    let i;
    for (i = 0; i < dataModelElements.length; i++) {
      const element = dataModelElements[i];
      const data = element.getAttribute('tc-data-model');
      element.innerHTML = getValue(this._model, data);
    }
  },
  showDropDownMenu(e) {
    const self = this;
    this.dismissDropDownMenu();
    e.toElement.nextElementSibling.classList.toggle('open');
    window.onclick = (event) => {
      if (!event.target.matches('.dropdown-toggle')) {
        self.dismissDropDownMenu();
      }
    };
  },
  dismissDropDownMenu() {
    const dropdownMenus = document.getElementsByClassName('dropdown-menu');
    for (let i = 0; i < dropdownMenus.length; i++) {
      const openDropdown = dropdownMenus[i];
      if (openDropdown.classList.contains('open')) {
        openDropdown.classList.remove('open');
      }
    }
  },
  selectCheckBoxState(state) {
    const checkbox = this._view.querySelector('[tc-data-action="check"]');
    checkbox.checked = state;
  },
};
