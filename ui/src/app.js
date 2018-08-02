import { ModalService } from './modalViewService';
import { EntryTableViewAdapter, EntryTableView, EntryTableController } from './entryListView';
import NavBarView from './navbarView';
import LoadingView from './loadngView';

export class MainView {
  constructor() {
    this.vieww = document.getElementById('main');
  }

  addChild(content) {
    // this.vieww.innerHTML = '';
    this.vieww.appendChild(content);
  }


  removeChild(content) {
    this.vieww.removeChild(content);
  }
}

export class MainViewController {
  constructor(mainView) {
    this.mainView = mainView;
    this.modalService = new ModalService();
    this.adapter = new EntryTableViewAdapter(this.modalService);
    this.entryTableView = new EntryTableView(this.adapter);
    this.entryTableController = new EntryTableController(this.entryTableView, this.modalService);
    this.navbar = new NavBarView();
  }

  initialize() {
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.authenticationToken) {
        // const self = this;
        const loadingView = new LoadingView();
        this.navbar.render();
        this.mainView.addChild(this.entryTableView.getViewElement());
        this.mainView.addChild(loadingView.getViewElement());
        this.entryTableController.initialize();
        this.entryTableController.onReady.attach(() => {
          this.mainView.removeChild(loadingView.getViewElement());
        });
      } else {
        window.location.replace('signin.html');
      }
    } else {
      // Sorry! No Web Storage support..
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const main = new MainViewController(new MainView());
  main.initialize();
});
