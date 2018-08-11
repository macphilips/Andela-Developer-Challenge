import { htmlToElement, showToast } from './util';
import { entryListHeader, emptyListTemple } from './templates';
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
    this.vieww.classList.add('entries-container');
    this.itemToRemove = [];
    this.addButtonClicked = new Event(this);
    this.adapter.registerChangeObserver(() => {
      this.render();
    });
  }

  getTableHeader() {
    const tableHead = htmlToElement(entryListHeader);
    const addButton = tableHead.querySelector('#addEntry');
    addButton.onclick = () => {
      this.addButtonClicked.notify({});
    };

    return tableHead;
  }

  getTableBody() {
    const { adapter } = this;
    const entryList = document.createElement('div');
    entryList.classList.add('entry-list');
    if (adapter.getSize() > 0) {
      for (let i = 0; i < adapter.getSize(); i += 1) {
        const viewItem = adapter.getViewItem(i);
        entryList.appendChild(viewItem.getViewElement());
      }
    } else {
      entryList.appendChild(htmlToElement(emptyListTemple.trim()));
    }
    return entryList;
  }

  render() {
    this.vieww.innerHTML = '';
    const entryListHead = this.getTableHeader();
    const entryListBody = this.getTableBody();
    this.vieww.appendChild(entryListHead);
    this.vieww.appendChild(entryListBody);
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
        const confirmDeleteView = new ConfirmDeleteEntryView(entryRowView.getModel());
        confirmDeleteView.actionButtonClicked.attach((context, args) => {
          if (args.action === 'ok') {
            if (args.status === 'success') {
              this.removeItem(itemModel);
            } else {
              showToast(`Unable to delete ${entryRowView.getModel()}`, 'error');
            }
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
