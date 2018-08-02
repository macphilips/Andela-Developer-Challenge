import {htmlToElement} from './util';
import {entryTableHeadTemplate, emptyListTemple} from './templates';
import EntryRowView from './entryListItemView';
import Event from './event';
import CreateEntryView from './entryView';
import ConfirmDeleteEntryView from './confirmDialog';
import RowItemModel from './itemModel';
import {entriesEndpoint} from './endpointUrl';
import http from './fetchWrapper';

export class EntryTableView {
  constructor(adapter) {
    this.adapter = adapter;
    this.vieww = document.createElement('div');
    this.vieww.setAttribute('id', 'entries');
    this.itemToRemove = [];
    this.selectAll = new Event(this);
    this.addButtonClicked = new Event(this);
    this.deleteButtonClicked = new Event(this);
    const self = this;
    this.adapter.registerChangeObserver(() => {
      self.render();
    });
  }

  showDeleteButton() {
    const deleteButton = this.vieww.querySelector('#deleteEntry');
    if (this.itemToRemove.length > 0) {
      deleteButton.style.visibility = 'visible';
      deleteButton.style.opacity = '1';
    } else {
      deleteButton.style.visibility = 'hidden';
      deleteButton.style.opacity = '0';
    }
  }

  contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
  }

  getTableHeader() {
    let self = this,
      adapter = this.adapter;
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = entryTableHeadTemplate;
    const addButton = tableHead.querySelector('#addEntry');
    const deleteButton = tableHead.querySelector('#deleteEntry');
    const selectAllInput = tableHead.querySelector('[tc-data-action="check"]');
    addButton.onclick = () => {
      self.addButtonClicked.notify({});
    };
    deleteButton.onclick = () => {
      self.deleteButtonClicked.notify({items: self.itemToRemove});
    };
    selectAllInput.onchange = () => {
      const {checked} = selectAllInput;
      self.itemToRemove = [];
      if (checked) {
        for (let i = 0; i < adapter.getSize(); i += 1) {
          self.itemToRemove.push(adapter.getViewItem(i).getModel());
        }
      }
      self.showDeleteButton();
      self.selectAll.notify({checkedState: checked});
    };
    return tableHead;
  }

  getTableBody() {
    const self = this;
    const adapter = this.adapter;
    const tableBody = document.createElement('tbody');
    if (adapter.getSize() > 0) {
      for (let i = 0; i < adapter.getSize(); i += 1) {
        (function () {
          const viewItem = adapter.getViewItem(i);
          self.attachCheckStateChangeListener(viewItem);
          tableBody.appendChild(viewItem.getViewElement());
        }());
      }
    } else {
      // todo
      tableBody.appendChild(htmlToElement(emptyListTemple.trim()));
    }
    return tableBody;
  }

  attachCheckStateChangeListener(viewItem) {
    const self = this;
    const adapter = this.adapter;
    viewItem.checkBoxChange.attach((conext, args) => {
      if (args.checked) {
        if (!self.contains(self.itemToRemove, args)) {
          self.itemToRemove.push(viewItem.getModel());
        }
      } else {
        self.itemToRemove = self.itemToRemove.filter(item => item.id !== args.id);
      }

      const selectAllInput = self.vieww.querySelector('thead [tc-data-action="check"]');
      selectAllInput.checked = self.itemToRemove.length === adapter.getSize();
      self.showDeleteButton();
    });
  }

  render() {
    this.vieww.innerHTML = '';
    const viewContainer = document.createElement('div');
    const table = document.createElement('table');
    const tableHead = this.getTableHeader();
    const tableBody = this.getTableBody();
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    viewContainer.appendChild(table);
    this.vieww.appendChild(viewContainer);
    viewContainer.classList.add('container');
    viewContainer.classList.add('entry-table');
  }

  getAdapter() {
    return this.adapter;
  }

  getViewElement() {
    return this.vieww;
  }
}

export class EntryTableViewAdapter {
  constructor(modalService) {
    this.data = [];
    this.viewItems = [];
    this.modalService = modalService;
    this.notifyChangeObserver = new Event(this);
  }

  getSize() {
    return (this.viewItems) ? this.viewItems.length : 0;
  }

  getViewItem(position) {
    const viewItem = this.viewItems[position];
    // const item = viewItem.getModel();
    viewItem.setPosition(position);
    return viewItem;
  }

  addItem(itemModel) {
    const entryRowView = new EntryRowView(itemModel);
    const self = this;
    entryRowView.clickAction.attach((source, arg) => {
      if (arg && arg.action === 'delete') {
        const confirmDeleteView = new ConfirmDeleteEntryView();
        confirmDeleteView.actionButtonClicked.attach((context, args) => {
          if (args.action === 'ok') {
            // todo delete itemModel from server and render list
            self.removeItem(itemModel);
          }
        });
        self.modalService.open(confirmDeleteView);
      } else {
        const entryView = new CreateEntryView(arg.model, arg.action);
        entryView.buttonClicked.attach((context, result) => {
          arg.model.content = result.content;
          arg.model.lastModified = result.lastModified;
          arg.model.createdDate = result.createdDate;
          self.modalService.getModalView().dismiss();
        });
        self.modalService.open(entryView);
      }
    });
    this.data.push(itemModel);
    this.viewItems.push(entryRowView);
    this.notifyChangeObservers();
  }

  addItems(items) {
    for (let i = 0; i < items.length; i += 1) {
      this.addItem(items[i]);
    }
    this.notifyChangeObservers();
  }

  removeItem(model) {
    this.viewItems = this.viewItems.filter(viewItem => viewItem.getModel().id !== model.id);
    this.data = this.data.filter(item => model.id !== item.id);
    this.notifyChangeObservers();
  }

  removeItems(items) {
    for (let i = 0; i < items.length; i += 1) {
      this.removeItem(items[i]);
    }
    this.notifyChangeObservers();
  }

  notifyChangeObservers() {
    this.notifyChangeObserver.notify();
  }

  registerChangeObserver(observer) {
    this.notifyChangeObserver.attach(observer);
  }

  selectAllItem(state) {
    for (let i = 0; i < this.viewItems.length; i += 1) {
      const viewItem = this.viewItems[i];
      viewItem.selectCheckBoxState(state);
    }
  }
}

export class EntryTableController {
  constructor(entryTableView, modalService) {
    this.entryTableView = entryTableView;
    // const self = this;
    entryTableView.addButtonClicked.attach(() => {
      const component = new CreateEntryView();
      // component.modalView = modalService.getModalView();
      component.buttonClicked.attach((context, args) => {
        modalService.getModalView().dismiss();
        this.entryTableView.getAdapter().addItem(new RowItemModel(args));
      });
      modalService.open(component);
    });
    entryTableView.selectAll.attach((context, args) => {
      this.entryTableView.getAdapter().selectAllItem(args.checkedState);
    });
    entryTableView.deleteButtonClicked.attach((context, args) => {
      const component = new ConfirmDeleteEntryView();
      component.modalView = modalService.getModalView();
      modalService.open(component);
      component.actionButtonClicked.attach(() => {
        // todo delete items from server
        this.entryTableView.getAdapter().removeItems(args.items);
      });
    });
    this.onReady = new Event(this);
  }

  initialize() {
    const adapter = this.entryTableView.getAdapter();
    const self = this;
    http.get(entriesEndpoint).then((result) => {
      const {entries} = result;
      const models = [];
      for (let i = 0; i < entries.length; i += 1) {
        models.push(new RowItemModel(entries[i]));
      }
      adapter.addItems(models);
      self.onReady.notify();
    }).catch(() => {
      self.onReady.notify();
    });
    this.entryTableView.render();
  }
}
