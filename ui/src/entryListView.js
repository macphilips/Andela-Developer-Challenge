import {
  htmlToElement, showToast, DOMDoc, windowInterface,
} from './utils/index';
import { emptyListTemple, entryListPageTemplate } from './utils/templates';
import EntryRowView from './views/entryRowView';
import Event from './utils/event';
import CreateEntryView from './views/entryView';
import ConfirmDeleteEntryView from './views/confirmDeleteEntryView';
import EntryItemModel from './views/entryItemModel';
import navBarView from './views/navBarView';
import { apiRequest, modalService } from './services';
import PaginationView from './views/paginationView';
import footerView from './views/footerView';
import LoadingView from './views/loadngView';

export class EntryListView {
  static contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
  }

  constructor(adapter) {
    this.adapter = adapter;
    this.root = htmlToElement(entryListPageTemplate);
    this.addButtonClicked = new Event(this);
    this.paginationView = new PaginationView();
    this.floatBtn = this.root.querySelector('#floatBtn .floating-button ');
    this.floatBtn.style.transform = 'scale(1)';
    this.floatBtn.style.bottom = '15px';
    this.adapter.registerChangeObserver(() => {
      this.render();
    });
    this.registerAddBtnClicked();
    this.scrollTimer = null;
    this.scrollEvent = this.handleScrollEvent();
    DOMDoc.addEventListener('scroll', this.scrollEvent);
  }

  handleScrollEvent() {
    return () => {
      if (!this.floatBtn) return;
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(() => {
        this.floatBtn.style.transform = 'scale(1)';
      }, 250);

      this.floatBtn.style.transform = 'scale(0)';
      const screenHeight = windowInterface.innerHeight;
      const scrollPos = windowInterface.scrollY + screenHeight;
      const bodyHeight = DOMDoc.body.offsetHeight;
      if (scrollPos > bodyHeight - 43) {
        this.floatBtn.style.bottom = `${scrollPos - bodyHeight + 43}px`;
      } else {
        this.floatBtn.style.bottom = '15px';
      }
    };
  }

  renderList() {
    const { adapter } = this;
    const entryList = this.root.querySelector('#entries .entry-list');
    if (!entryList) return null;
    entryList.innerHTML = '';
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
    this.paginationView.render(this.root, this.adapter.getPageInfo());
    navBarView.render(this.root);
    footerView.render(this.root);
    this.renderList();
  }

  registerAddBtnClicked() {
    const handler = () => {
      this.addButtonClicked.notify({});
    };
    const addButton = this.root.querySelectorAll('.add-btn-js');
    for (let i = 0; i < addButton.length; i += 1) {
      addButton[i].onclick = handler;
    }
  }

  getAdapter() {
    return this.adapter;
  }

  getViewElement() {
    return this.root;
  }

  getPaginationView() {
    return this.paginationView;
  }

  onLoadEntries() {
    const entryList = this.root.querySelector('#entries .entry-list');
    if (!entryList) return;
    const loadingView = new LoadingView();
    entryList.innerHTML = '';
    const container = DOMDoc.createElement('div');
    container.style.position = 'relative';
    container.style.height = '65vh';
    container.appendChild(loadingView.getViewElement());
    entryList.appendChild(container);
  }

  onDestroy() {
    DOMDoc.removeEventListener('scroll', this.scrollEvent);
  }
}

export class EntryListViewAdapter {
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
    entryRowView.clickAction.attach((source, arg) => {
      if (arg && arg.action === 'delete') {
        const confirmDeleteView = new ConfirmDeleteEntryView(entryRowView.getModel());
        confirmDeleteView.actionButtonClicked.attach((context, args) => {
          if (args.action === 'ok') {
            if (args.status === 'success') {
              this.removeItems([itemModel]);
            } else {
              const data = { title: 'Error', message: `Unable to delete ${entryRowView.getModel()}` };
              showToast(data, 'error');
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
    // this.notifyChangeObservers();
  }

  addItems(items) {
    this.updateList(items, item => this.addItem(item));
  }

  removeItem(model) {
    this.viewItems = this.viewItems.filter(viewItem => viewItem.getModel().id !== model.id);
    this.data = this.data.filter(item => model.id !== item.id);
    // this.notifyChangeObservers();
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

export class EntryListController {
  /**
   *
   * @param entryListView {EntryListView}
   */
  constructor(entryListView) {
    this.page = 1;
    this.size = 25;
    this.entryListView = entryListView;
    entryListView.addButtonClicked.attach(() => {
      const component = new CreateEntryView();
      component.buttonClicked.attach((context, args) => {
        modalService.getModalView().dismiss();
        this.entryListView.getAdapter().addItems([new EntryItemModel(args.entry)]);
      });
      modalService.open(component);
    });
    entryListView.getPaginationView().onChangePage.attach((context, args) => {
      this.entryListView.onLoadEntries();
      this.loadEntries({ page: args.page, size: this.size });
    });
    this.onReady = new Event(this);
  }

  initialize() {
    this.loadEntries({ page: this.page, size: this.size });
  }

  loadEntries(query) {
    const adapter = this.entryListView.getAdapter();
    apiRequest.getEntries(query).then((result) => {
      adapter.reset();
      const { size } = query;
      const { data } = result;
      const { entries, page, totalEntries } = data;
      const models = [];
      for (let i = 0; i < entries.length; i += 1) {
        models.push(new EntryItemModel(entries[i]));
      }
      adapter.setPageInfo({ page, totalEntries, size });
      adapter.addItems(models);
      this.onReady.notify();
    }).catch(() => {
      this.onReady.notify();
    });
    this.entryListView.render();
  }

  getViewElement() {
    return this.entryListView.getViewElement();
  }

  onRemove() {
    this.entryListView.onDestroy();
  }
}
