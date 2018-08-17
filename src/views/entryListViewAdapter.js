import Event from '../utils/event';
import EntryRowView from './entryRowView';

export default class EntryListViewAdapter {
  constructor() {
    this.data = [];
    this.viewItems = [];
    this.notifyChangeObserver = new Event(this);
    this.pageInfo = null;
  }

  reset() {
    this.data = [];
    this.viewItems = [];
    this.notifyChangeObservers();
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
    this.data.push(itemModel);
    this.viewItems.push(entryRowView);
  }

  addItems(items) {
    this.updateList(items, item => this.addItem(item));
  }

  removeItem(model) {
    this.viewItems = this.viewItems.filter(viewItem => viewItem.getModel().id !== model.id);
    this.data = this.data.filter(item => model.id !== item.id);
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

  setPageInfo(info) {
    this.pageInfo = info;
  }

  getPageInfo() {
    return this.pageInfo;
  }
}
