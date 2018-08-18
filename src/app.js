import EntryListPage from './entryListPage';
import LoadingView from './views/loadngView';
import { DOMDoc, gotoUrl, windowInterface } from './utils';
import route from './route';
import SignInPage from './signInPage';
import ProfilePage from './profilePage';
import HomePage from './homePage';
import {
  account, apiRequest, loginService, footerViewService, navBarViewService, modalService,
} from './services';
import SignUpPage from './signUpPage';
import PageNotFound from './notFount';

class MainView {
  constructor() {
    this.viewElement = DOMDoc.getElementById('main');
    this.currentController = null;
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
      console.error(e.message);
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
    const navFooterParam = [footerViewService, navBarViewService];
    const apiRequestWithNavFooter = [apiRequest, ...navFooterParam];
    const entryCtrl = {
      Type: EntryListPage, params: [...apiRequestWithNavFooter, modalService],
    };
    const profilePageCtrl = {
      Type: ProfilePage, params: [account, ...apiRequestWithNavFooter],
    };
    const signInPageCtrl = {
      Type: SignInPage, params: [loginService, ...navFooterParam],
    };
    const signUpPageCtrl = {
      Type: SignUpPage, params: apiRequestWithNavFooter,
    };
    const homePageCtrl = {
      Type: HomePage, params: [account, ...navFooterParam],
    };
    const pageNotFoundCtrl = {
      Type: PageNotFound, params: navFooterParam,
    };
    this.loadingView = new LoadingView();
    route.registerRoutes('/dashboard', entryCtrl, true);
    route.registerRoutes('/profile', profilePageCtrl, true);
    route.registerRoutes('/signin', signInPageCtrl, false);
    route.registerRoutes('/signup', signUpPageCtrl, false);
    route.registerRoutes('/', homePageCtrl, false);
    route.registerRoutes('*', pageNotFoundCtrl, false);
  }

  route() {
    return () => {
      const url = windowInterface.location.hash.slice(1) || '/';
      const routes = route.routes[url] || route.routes['*'];
      if (routes && routes.controller) {
        this.removeController();
        this.mainView.addChild(this.loadingView.getViewElement());
        const { controller, requireAuth } = routes;
        const ctrl = this.createInstant(controller);
        account.identify().then(() => {
          this.renderView(ctrl);
        }).catch(() => {
          if (requireAuth) {
            gotoUrl('#/signin');
          } else {
            this.renderView(ctrl);
          }
        });
      }
    };
  }

  removeController() {
    windowInterface.scrollTo(0, 0);
    if (this.currentController && this.currentController.onRemove) {
      this.currentController.onRemove();
    }
    this.mainView.removeAllChildren();
  }

  renderView(ctrl) {
    if (ctrl.onReady) {
      ctrl.onReady.attach(() => {
        this.addViewToMainView(ctrl);
      });
    } else {
      this.addViewToMainView(ctrl);
    }
    if (ctrl.initialize) ctrl.initialize();
    this.currentController = ctrl;
  }

  addViewToMainView(ctrl) {
    this.mainView.removeAllChildren();
    this.mainView.addChild(ctrl.getViewElement());
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
