function EntryTableView(adapter) {
  this._adapter = adapter;
  this._view = document.createElement('div');
  this._view.setAttribute('id', 'entries');
  this.itemToRemove = [];
  this.selectAll = new Event(this);
  this.addButtonClicked = new Event(this);
  this.deleteButtonClicked = new Event(this);
  const self = this;
  this._adapter.registerChangeObserver(() => {
    self.render();
  });
}

EntryTableView.prototype = {
  showDeleteButton() {
    const deleteButton = this._view.querySelector('#deleteEntry');
    if (this.itemToRemove.length > 0) {
      deleteButton.style.visibility = 'visible';
      deleteButton.style.opacity = '1';
    } else {
      deleteButton.style.visibility = 'hidden';
      deleteButton.style.opacity = '0';
    }
  },
  contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
  },
  getTableHeader() {
    let self = this,
      adapter = this._adapter;
    const table_head = document.createElement('thead');
    table_head.innerHTML = entryTableHeadTemplate;
    const addButton = table_head.querySelector('#addEntry');
    const deleteButton = table_head.querySelector('#deleteEntry');
    const selectAllInput = table_head.querySelector('[tc-data-action="check"]');
    addButton.onclick = () => {
      self.addButtonClicked.notify({});
    };
    deleteButton.onclick = () => {
      self.deleteButtonClicked.notify({ items: self.itemToRemove });
    };
    selectAllInput.onchange = () => {
      const checked = selectAllInput.checked;
      self.itemToRemove = [];
      if (checked) {
        for (let i = 0; i < adapter.getSize(); i++) {
          self.itemToRemove.push(adapter.getViewItem(i).getModel());
        }
      }
      self.showDeleteButton();
      self.selectAll.notify({ checkedState: checked });
    };
    return table_head;
  },
  getTableBody() {
    let self = this,
      adapter = this._adapter;
    const table_body = document.createElement('tbody');
    if (adapter.getSize() > 0) {
      for (var i = 0; i < adapter.getSize(); i++) {
        (function () {
          const viewItem = adapter.getViewItem(i);
          self.attachCheckStateChangeListener(viewItem);
          table_body.appendChild(viewItem.getViewElement());
        }());
      }
    } else {
      // todo
    }
    return table_body;
  },
  attachCheckStateChangeListener(viewItem) {
    let self = this,
      adapter = this._adapter;
    viewItem.checkBoxChange.attach((conext, args) => {
      if (args.checked) {
        if (!self.contains(self.itemToRemove, args)) {
          self.itemToRemove.push(viewItem.getModel());
        }
      } else {
        self.itemToRemove = self.itemToRemove.filter(item => item.id !== args.id);
      }

      const selectAllInput = self._view.querySelector('thead [tc-data-action="check"]');
      selectAllInput.checked = self.itemToRemove.length === adapter.getSize();
      self.showDeleteButton();
    });
  },
  render() {
    this._view.innerHTML = '';
    const viewContainer = document.createElement('div');
    const table = document.createElement('table');
    const table_head = this.getTableHeader();
    const table_body = this.getTableBody();
    table.appendChild(table_head);
    table.appendChild(table_body);
    viewContainer.appendChild(table);
    this._view.appendChild(viewContainer);
    viewContainer.classList.add('container');
    viewContainer.classList.add('entry-table');
  },
  getAdapter() {
    return this._adapter;
  },
  getViewElement() {
    return this._view;
  },
};

function EntryTableViewAdapter(modalService) {
  this._data = [];
  this._viewItems = [];
  this._modalService = modalService;
  this._notifyChangeObserver = new Event(this);
}

EntryTableViewAdapter.prototype = {
  getSize() {
    return (this._viewItems) ? this._viewItems.length : 0;
  },
  getViewItem(position) {
    const viewItem = this._viewItems[position];
    const item = viewItem.getModel();
    viewItem.setPosition(position);
    return viewItem;
  },
  addItem(itemModel) {
    const view = new EntryRowView(itemModel);
    const self = this;
    view.clickAction.attach((source, arg) => {
      if (arg && arg.action === 'delete') {
        const view = new ConfirmDeleteEntryView();
        view.actionButtonClicked.attach((context, args) => {
          if (args.action === 'ok') {
            // todo delete itemModel from server and render list
            self.removeItem(itemModel);
          }
        });
        self._modalService.open(view);
      } else {
        self._modalService.open(new CreateEntryView(arg.model, arg.action));
      }
    });
    this._data.push(itemModel);
    this._viewItems.push(view);
    this.notifyChangeObservers();
  },
  addItems(items) {
    for (let i = 0; i < items.length; i++) {
      this.addItem(items[i]);
    }
    this.notifyChangeObservers();
  },
  removeItem(model) {
    this._viewItems = this._viewItems.filter(viewItem => viewItem.getModel().id !== model.id);
    this._data = this._data.filter(item => model.id !== item.id);
    this.notifyChangeObservers();
  },
  removeItems(items) {
    for (let i = 0; i < items.length; i++) {
      this.removeItem(items[i]);
    }
    this.notifyChangeObservers();
  },
  notifyChangeObservers() {
    this._notifyChangeObserver.notify();
  },
  registerChangeObserver(observer) {
    this._notifyChangeObserver.attach(observer);
  },
  selectAllItem(state) {
    for (let i = 0; i < this._viewItems.length; i++) {
      const viewItem = this._viewItems[i];
      viewItem.selectCheckBoxState(state);
    }
  },
};

function EntryTableController(view, modalService) {
  this._view = view;
  const self = this;
  view.addButtonClicked.attach(() => {
    const component = new CreateEntryView();
    component.modalView = modalService.getModalView();
    modalService.open(component);
  });
  view.selectAll.attach((context, args) => {
    self._view.getAdapter().selectAllItem(args.checkedState);
  });
  view.deleteButtonClicked.attach((context, args) => {
    const component = new ConfirmDeleteEntryView();
    component.modalView = modalService.getModalView();
    modalService.open(component);
    component.actionButtonClicked.attach(() => {
      // todo delete items from server
      console.log('action ok deleting items from server =>', args.items);
      self._view.getAdapter().removeItems(args.items);
    });
  });
  this.onReady = new Event(this);
}

EntryTableController.prototype = {
  initialize() {
    const adapter = this._view.getAdapter();
    const self = this;
    loadEntries((result) => {
      const models = [];
      for (let i = 0; i < result.length; i++) {
        models.push(new RowItemModel(result[i]));
      }
      adapter.addItems(models);
      self.onReady.notify();
    });
    -this._view.render();
  },
};
