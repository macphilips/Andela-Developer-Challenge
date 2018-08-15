import { EntryListController, EntryListView, EntryListViewAdapter } from './entryListView';
import LoadingView from './views/loadngView';
import { DOMDoc, gotoUrl, windowInterface } from './utils/util';
import route from './route';
import SignInPage from './signInPage';
import ProfilePage from './profilePage';
import HomePage from './homePage';
import { account } from './services';
import SignUpPage from './signUpPage';

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
      this.removeChild(children[i]);
    }
  }

  getViewElement() {
    return this.viewElement;
  }
}

class MainViewController {
  /**
   *
   * @param mainView {MainView}
   */
  constructor(mainView) {
    this.mainView = mainView;
    // this.adapter = new EntryListViewAdapter();
    // this.entryTableView = new EntryListView(this.adapter);
    // this.entryTableController = new EntryListController(this.entryTableView);
    const tAdapter = {
      Type: EntryListViewAdapter, params: null,
    };
    const aEntryView = {
      Type: EntryListView,
      params: [tAdapter],
    };
    const entryCtrl = {
      Type: EntryListController,
      params: [aEntryView],
    };
    this.loadingView = new LoadingView();
    route.registerRoutes('/dashboard', entryCtrl, true);
    route.registerRoutes('/profile', ProfilePage, true);
    route.registerRoutes('/signin', SignInPage, false);
    route.registerRoutes('/signup', SignUpPage, false);
    route.registerRoutes('/', HomePage, false);
    route.registerRoutes('*', HomePage, false);
  }

  route() {
    return () => {
      const url = windowInterface.location.hash.slice(1) || '/';
      const routes = route.routes[url] || route.routes['*'];
      if (routes && routes.controller) {
        this.mainView.removeAllChildren();
        const { controller, requireAuth } = routes;
        const ctrl = this.createInstant(controller);
        if (requireAuth) {
          account.identify().then(() => {
            this.renderView(ctrl);
          }).catch(() => {
            gotoUrl('#/signin');
          });
        } else {
          this.renderView(ctrl);
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

  getArguments(params) {
    const args = [];
    if (params instanceof Array) {
      params.forEach((Item) => {
        let instance = null;
        const type = typeof (Item);
        if (type === 'object' && Item.Type) {
          instance = this.createInstant(Item);
        } else if (type === 'function') {
          instance = new Item();
        } else {
          instance = Item;
        }
        args.push(instance);
      });
    } else {
      throw Error('params must be an array ');
    }
    return args;
  }

  createInstant(Obj) {
    let args = [];
    const { params, Type } = Obj;
    if (params) {
      args = this.getArguments(params, args);
    }
    if (Type && typeof (Type) === 'function') {
      return new Type(...args);
    }
    if (typeof (Obj) === 'function') {
      return new Obj();
    }
    return Type || Obj;
  }
}

const main = new MainViewController(new MainView());
windowInterface.addEventListener('hashchange', main.route());
DOMDoc.addEventListener('DOMContentLoaded', main.route());
