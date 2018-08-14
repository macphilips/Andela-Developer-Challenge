import { htmlToElement, showToast, DOMDoc } from './utils/util';
import { entryListHeader, emptyListTemple, floatingButton } from './utils/templates';
import EntryRowView from './views/entryRowView';
import Event from './utils/event';
import CreateEntryView from './views/entryView';
import ConfirmDeleteEntryView from './views/confirmDeleteEntryView';
import EntryItemModel from './views/entryItemModel';
import { entriesEndpoint } from './utils/endpointUrl';
import http from './services/fetchWrapper';
import navBarView from './views/navBarView';
import modalService from './services/modalViewService';

export class EntryListView {
  static contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
  }

  constructor(adapter) {
    this.adapter = adapter;
    this.root = DOMDoc.createElement('div');
    this.root.classList.add('main');

    this.viewElement = DOMDoc.createElement('div');
    this.viewElement.setAttribute('id', 'entries');
    this.viewElement.classList.add('entries-container');
    this.addButtonClicked = new Event(this);
    this.adapter.registerChangeObserver(() => {
      this.render();
    });
  }

  getTableBody() {
    const { adapter } = this;
    const entryList = DOMDoc.createElement('div');
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
    const handler = () => {
      this.addButtonClicked.notify({});
    };
    const entryListHead = htmlToElement(entryListHeader);
    const floatBtnElement = htmlToElement(floatingButton);
    const entryListBody = this.getTableBody();

    this.viewElement.innerHTML = '';
    const navbar = DOMDoc.createElement('div');
    navbar.setAttribute('id', 'navbar');
    this.viewElement.appendChild(navbar);
    this.viewElement.appendChild(entryListHead);
    this.viewElement.appendChild(entryListBody);
    this.viewElement.appendChild(floatBtnElement);
    this.root.appendChild(this.viewElement);
    navBarView.render(this.viewElement);

    const addButton = this.viewElement.querySelector('#addEntry');
    addButton.onclick = handler;
    floatBtnElement.onclick = handler;
  }

  getAdapter() {
    return this.adapter;
  }

  getViewElement() {
    return this.root;
  }
}

export class EntryListViewAdapter {
  constructor() {
    this.data = [];
    this.viewItems = [];
    this.notifyChangeObserver = new Event(this);
  }

  getSize() {
    return (this.viewItems) ? this.viewItems.length : 0;
  }

  getViewItem(position) {
    const viewItem = this.viewItems[position];
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
        modalService.open(confirmDeleteView);
      } else {
        const entryView = new CreateEntryView(arg.model, arg.action);
        entryView.buttonClicked.attach(EntryListViewAdapter.registerButtonLister(arg));
        modalService.open(entryView);
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

  static registerButtonLister(arg) {
    return (context, result) => {
      const { entry } = result;
      const { model } = arg;
      model.title = entry.title;
      model.content = entry.content;
      model.lastModified = entry.lastModified;
      model.createdDate = entry.createdDate;
      modalService.getModalView().dismiss();
    };
  }
}

export class EntryListController {
  constructor(entryTableView) {
    this.entryTableView = entryTableView;
    entryTableView.addButtonClicked.attach(() => {
      const component = new CreateEntryView();
      component.buttonClicked.attach((context, args) => {
        modalService.getModalView().dismiss();
        this.entryTableView.getAdapter().addItem(new EntryItemModel(args.entry));
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
        models.push(new EntryItemModel(entries[i]));
      }
      adapter.addItems(models);
      this.onReady.notify();
    }).catch(() => {
      this.onReady.notify();
    });
    this.entryTableView.render();
  }

  getViewElement() {
    return this.entryTableView.getViewElement();
  }
}
