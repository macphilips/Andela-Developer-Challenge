import { ModalService } from './modalViewService';
import { EntryTableController, EntryTableView, EntryTableViewAdapter } from './entryListView';
import LoadingView from './loadngView';
import { DOMDoc, gotoUrl, windowInterface } from './util';
import route from './route';
import { SignInPage, SignUpPage } from './signin';
import ProfilePage from './profile';
import HomePage from './index';
import account from './account';

class MainView {
  constructor() {
    this.viewElement = DOMDoc.getElementById('main');
  }

  addChild(content) {
    if (content != null) {
      this.viewElement.appendChild(content);
    }
  }

  removeChild(content) {
    try {
      if (content !== null) {
        this.viewElement.removeChild(content);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  removeAllChildren() {
    const { children } = this.viewElement;
    for (let i = 0; i < children.length; i += 1) {
      this.viewElement.removeChild(children[i]);
    }
  }

  getViewElement() {
    return this.viewElement;
  }
}

class MainViewController {
  constructor(mainView) {
    this.mainView = mainView;
    this.modalService = new ModalService();
    this.adapter = new EntryTableViewAdapter(this.modalService);
    this.entryTableView = new EntryTableView(this.adapter);
    this.entryTableController = new EntryTableController(this.entryTableView, this.modalService);

    this.loadingView = new LoadingView();
    route.registerRoutes('/dashboard', this.entryTableController, true);
    route.registerRoutes('/profile', new ProfilePage(), true);
    route.registerRoutes('/signin', new SignInPage(), false);
    route.registerRoutes('/signup', new SignUpPage(), false);
    route.registerRoutes('/', new HomePage(), false);
    route.registerRoutes('*', new HomePage(), false);
  }

  // initialize() {
  //   if (getToken()) {
  //     this.mainView.addChild(this.entryTableView.getViewElement());
  //     this.mainView.addChild(this.loadingView.getViewElement());
  //     this.entryTableController.initialize();
  //     this.entryTableController.onReady.attach(() => {
  //       this.mainView.removeChild(this.loadingView.getViewElement());
  //     });
  //   } else {
  //     gotoUrl('#/signin');
  //   }
  // }

  route() {
    return (e) => {
      const url = windowInterface.location.hash.slice(1) || '/';
      const routes = route.routes[url] || route.routes['*'];
      if (routes && routes.controller) {
        this.removeOldElement(e, route.routes);
        const { controller, requireAuth } = routes;
        if (requireAuth) {
          account.identify().then(() => {
            this.renderView(controller);
          }).catch(() => {
            gotoUrl('#/signin');
          });
        } else {
          this.renderView(controller);
        }
      }
    };
  }

  renderView(ctrl) {
    if (ctrl.onReady) {
      this.mainView.addChild(this.loadingView.getViewElement());
      ctrl.onReady.attach(() => {
        const loader = this.mainView.getViewElement().querySelector('#loader');
        this.mainView.removeChild(loader);
        this.mainView.addChild(ctrl.getViewElement());
      });
    } else {
      this.mainView.addChild(ctrl.getViewElement());
    }
    if (ctrl.initialize) ctrl.initialize();
  }

  removeOldElement(e, routes) {
    if (e.oldURL) {
      const start = e.oldURL.indexOf('#');
      let oldPath = '/';
      if (start > 0) {
        oldPath = e.oldURL.substring(start + 1);
      }
      const routee = routes[oldPath];
      if (routee && routee.controller) {
        const oldCtrl = routee.controller;
        this.mainView.removeChild(oldCtrl.getViewElement());
      }
    }
  }
}

const main = new MainViewController(new MainView());
windowInterface.addEventListener('hashchange', main.route());
DOMDoc.addEventListener('DOMContentLoaded', main.route());
