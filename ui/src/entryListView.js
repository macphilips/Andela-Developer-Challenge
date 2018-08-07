import { htmlToElement } from './util';
import { entryTableHeadTemplate, emptyListTemple } from './templates';
import EntryRowView from './entryListItemView';
import Event from './event';
import CreateEntryView from './entryView';
import ConfirmDeleteEntryView from './confirmDialog';
import RowItemModel from './itemModel';
import { entriesEndpoint } from './endpointUrl';
import http from './fetchWrapper';

export class EntryTableView {
  static contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
  }

  constructor(adapter) {
    this.adapter = adapter;
    this.vieww = document.createElement('div');
    this.vieww.setAttribute('id', 'entries');
    this.itemToRemove = [];
    this.selectAll = new Event(this);
    this.addButtonClicked = new Event(this);
    this.deleteButtonClicked = new Event(this);
    this.adapter.registerChangeObserver(() => {
      this.render();
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

  getTableHeader() {
    const { adapter } = this;
    const tableHead = document.createElement('thead');
    tableHead.innerHTML = entryTableHeadTemplate;
    const addButton = tableHead.querySelector('#addEntry');
    const deleteButton = tableHead.querySelector('#deleteEntry');
    const selectAllInput = tableHead.querySelector('[tc-data-action="check"]');
    addButton.onclick = () => {
      this.addButtonClicked.notify({});
    };
    deleteButton.onclick = () => {
      this.deleteButtonClicked.notify({ items: this.itemToRemove });
    };
    selectAllInput.onchange = () => {
      const { checked } = selectAllInput;
      this.itemToRemove = [];
      if (checked) {
        for (let i = 0; i < adapter.getSize(); i += 1) {
          this.itemToRemove.push(adapter.getViewItem(i).getModel());
        }
      }
      this.showDeleteButton();
      this.selectAll.notify({ checkedState: checked });
    };
    return tableHead;
  }

  getTableBody() {
    const { adapter } = this;
    const tableBody = document.createElement('tbody');
    if (adapter.getSize() > 0) {
      for (let i = 0; i < adapter.getSize(); i += 1) {
        const viewItem = adapter.getViewItem(i);
        this.attachCheckStateChangeListener(viewItem);
        tableBody.appendChild(viewItem.getViewElement());
      }
    } else {
      tableBody.appendChild(htmlToElement(emptyListTemple.trim()));
    }
    return tableBody;
  }

  attachCheckStateChangeListener(viewItem) {
    const { adapter } = this;
    viewItem.checkBoxChange.attach((conext, args) => {
      if (args.checked) {
        if (!EntryTableView.contains(this.itemToRemove, args)) {
          this.itemToRemove.push(viewItem.getModel());
        }
      } else {
        this.itemToRemove = this.itemToRemove.filter(item => item.id !== args.id);
      }

      const selectAllInput = this.vieww.querySelector('thead [tc-data-action="check"]');
      selectAllInput.checked = this.itemToRemove.length === adapter.getSize();
      this.showDeleteButton();
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
    entryRowView.clickAction.attach((source, arg) => {
      if (arg && arg.action === 'delete') {
        const confirmDeleteView = new ConfirmDeleteEntryView();
        confirmDeleteView.actionButtonClicked.attach((context, args) => {
          if (args.action === 'ok') {
            // todo delete itemModel from server and render list
            this.removeItem(itemModel);
          }
        });
        this.modalService.open(confirmDeleteView);
      } else {
        const entryView = new CreateEntryView(arg.model, arg.action);
        entryView.buttonClicked.attach(this.registerButtonLister(arg));
        this.modalService.open(entryView);
      }
    });
    this.data.push(itemModel);
    this.viewItems.push(entryRowView);
    this.notifyChangeObservers();
  }

  addItems(items) {
    this.updateList(items, item => this.addItem(item));
  }

  removeItem(model) {
    this.viewItems = this.viewItems.filter(viewItem => viewItem.getModel().id !== model.id);
    this.data = this.data.filter(item => model.id !== item.id);
    this.notifyChangeObservers();
  }

  removeItems(items) {
    this.updateList(items, item => this.removeItem(item));
  }

  updateList(items, action) {
    if (action === null) return;
    for (let i = 0; i < items.length; i += 1) {
      action(items[i]);
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

  registerButtonLister(arg) {
    return (context, result) => {
      const { entry } = result;
      const { model } = arg;
      model.title = entry.title;
      model.content = entry.content;
      model.lastModified = entry.lastModified;
      model.createdDate = entry.createdDate;
      this.modalService.getModalView().dismiss();
    };
  }
}

export class EntryTableController {
  constructor(entryTableView, modalService) {
    this.entryTableView = entryTableView;
    entryTableView.addButtonClicked.attach(() => {
      const component = new CreateEntryView();
      // component.modalView = modalService.getModalView();
      component.buttonClicked.attach((context, args) => {
        modalService.getModalView().dismiss();
        this.entryTableView.getAdapter().addItem(new RowItemModel(args.entry));
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
    http.get(entriesEndpoint).then((result) => {
      const { entries } = result;
      const models = [];
      for (let i = 0; i < entries.length; i += 1) {
        models.push(new RowItemModel(entries[i]));
      }
      adapter.addItems(models);
      this.onReady.notify();
    }).catch(() => {
      this.onReady.notify();
    });
    this.entryTableView.render();
  }
}
