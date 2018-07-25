function MainView() {
  this._view = document.getElementById('main');
}

MainView.prototype = {
  addChild(content) {
    // this._view.innerHTML = '';
    this._view.appendChild(content);
  },
  removeChild(content) {
    this._view.removeChild(content);
  },
};

function MainViewController(mainView) {
  this._mainView = mainView;
  this.modalService = new ModalService();
  this.adapter = new EntryTableViewAdapter(this.modalService);
  this.view = new EntryTableView(this.adapter);
  this.entryTableController = new EntryTableController(this.view, this.modalService);
  this.navbar = new NavBarView();
}

MainViewController.prototype = {
  initialize() {
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.authenticationToken) {
        const self = this;
        const loadingView = new LoadingView();
        this.navbar.render();
        this._mainView.addChild(this.view.getViewElement());
        this._mainView.addChild(loadingView.getViewElement());
        this.entryTableController.initialize();
        this.entryTableController.onReady.attach(() => {
          self._mainView.removeChild(loadingView.getViewElement());
        });
      } else {
        window.location.replace('signin.html');
      }
    } else {
      // Sorry! No Web Storage support..
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const main = new MainViewController(new MainView());
  main.initialize();
});
