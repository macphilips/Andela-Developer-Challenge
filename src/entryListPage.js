import { windowInterface } from './utils/index';
import Event from './utils/event';
import EntryItemModel from './views/entryItemModel';
import EntryListView from './views/entryListView';

export default class EntryListPage {
  /**
   *
   * @param apiRequest {ApiRequestService}
   * @param footerViewService {FooterViewService}
   * @param navBarViewService {NavBarViewService}
   * @param modalService {ModalService}
   */
  constructor(apiRequest, footerViewService, navBarViewService, modalService) {
    this.page = 1;
    this.size = 10;
    this.apiRequest = apiRequest;
    this.entryListView = new EntryListView(apiRequest, footerViewService,
      navBarViewService, modalService);
    this.entryListView.getPaginationView().onChangePage.attach((context, args) => {
      this.page = args.page;
      this.refreshEntriesList();
    });
    this.entryListView.refresh.attach(() => {
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
    this.apiRequest.getEntries(query).then((result) => {
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
