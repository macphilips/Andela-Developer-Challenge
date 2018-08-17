import { windowInterface } from './utils/index';
import Event from './utils/event';
import EntryItemModel from './views/entryItemModel';
import { apiRequest } from './services';

export default class EntryListController {
  /**
   *
   * @param entryListView {EntryListView}
   */
  constructor(entryListView) {
    this.page = 1;
    this.size = 10;
    this.entryListView = entryListView;
    entryListView.getPaginationView().onChangePage.attach((context, args) => {
      this.page = args.page;
      this.refreshEntriesList();
    });
    entryListView.refresh.attach(() => {
      this.refreshEntriesList();
    });
    this.onReady = new Event(this);
  }

  refreshEntriesList() {
    windowInterface.scrollTo(0, 0);
    this.entryListView.onLoadEntries();
    this.loadEntries({ page: this.page, size: this.size });
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
      this.page = page;
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
