import {
  DOMDoc, htmlToElement, showToast, windowInterface,
} from '../utils';
import { emptyListTemple, entryListPageTemplate } from '../utils/templates';
import Event from '../utils/event';
import PaginationView from './paginationView';
import CreateEntryView from './entryView';
import ConfirmDeleteEntryView from './confirmDeleteEntryView';
import EntryItemModel from './entryItemModel';
import LoadingView from './loadngView';
import EntryListViewAdapter from './entryListViewAdapter';

export default class EntryListView {
  static contains(arr, element) {
    const items = arr.filter(item => item.id === element.id);
    return items.length > 0;
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

  /**
   *
   * @param apiRequest {ApiRequestService}
   * @param footerViewService {FooterViewService}
   * @param navBarViewService {NavBarViewService}
   * @param modalService {ModalService}
   */
  constructor(apiRequest, footerViewService, navBarViewService, modalService) {
    this.apiRequest = apiRequest;
    this.modalService = modalService;
    this.footerViewService = footerViewService;
    this.navBarViewService = navBarViewService;
    this.adapter = new EntryListViewAdapter();
    this.root = htmlToElement(entryListPageTemplate);
    this.refresh = new Event(this);
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
        this.registerViewItemEvents(viewItem);
        entryList.appendChild(viewItem.getViewElement());
      }
    } else {
      entryList.appendChild(htmlToElement(emptyListTemple.trim()));
    }
    return entryList;
  }

  registerViewItemEvents(viewItem) {
    viewItem.clickAction.attach((source, arg) => {
      if (arg && arg.action === 'delete') {
        this.openConfirmationDialog(viewItem);
      } else {
        const entryView = new CreateEntryView(this.apiRequest, arg.model, arg.action);
        entryView.buttonClicked.attach(this.registerButtonLister(arg));
        this.modalService.open(entryView);
      }
    });
  }

  openConfirmationDialog(viewItem) {
    const confirmDeleteView = new ConfirmDeleteEntryView(this.apiRequest, viewItem.getModel());
    confirmDeleteView.actionButtonClicked.attach((context, args) => {
      if (args.action === 'ok') {
        if (args.status === 'success') {
          this.refresh.notify();
        } else {
          const data = { title: 'Error', message: `Unable to delete ${viewItem.getModel()}` };
          showToast(data, 'error');
        }
      }
    });
    this.modalService.open(confirmDeleteView);
  }

  openCreateEntryView() {
    const component = new CreateEntryView(this.apiRequest);
    component.buttonClicked.attach((context, args) => {
      this.modalService.getModalView().dismiss();
      this.adapter.addItems([new EntryItemModel(args.entry)]);
      this.refresh.notify();
    });
    this.modalService.open(component);
  }

  render() {
    this.paginationView.render(this.root, this.adapter.getPageInfo());
    this.navBarViewService.render(this.root);
    this.footerViewService.render(this.root);
    this.renderList();
  }

  registerAddBtnClicked() {
    const handler = () => {
      this.openCreateEntryView();
    };
    const addButton = this.root.querySelectorAll('.add-btn-js');
    for (let i = 0; i < addButton.length; i += 1) {
      addButton[i].onclick = handler;
    }
  }

  /**
   *
   * @returns {EntryListViewAdapter}
   */
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
