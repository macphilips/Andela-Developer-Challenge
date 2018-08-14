import { DOMDoc, gotoUrl, htmlToElement } from '../utils/util';
import { navbarHeaderTemplate } from '../utils/templates';
import account from '../services/account';
import loginService from '../services/loginService';

class NavBarView {
  static logoutHandle() {
    loginService.logout();
    gotoUrl('#/');
  }

  constructor() {
    this.vieewElement = null;
    this.childView = htmlToElement(navbarHeaderTemplate);
  }

  init() {
    const logout = this.childView.querySelectorAll('.logout-js');
    logout[0].onclick = NavBarView.logoutHandle;
    logout[1].onclick = NavBarView.logoutHandle;

    const dismissSideNavButton = this.childView.querySelector('[tc-data-dismiss="side-nav"]');
    dismissSideNavButton.onclick = () => {
      this.hideOrShowSideNav('hide');
    };
    const showSideNavButton = this.childView.querySelector('.navicon');
    showSideNavButton.onclick = () => {
      this.hideOrShowSideNav('show');
    };

    const sideNav = this.childView.querySelector('.side-nav');
    sideNav.onclick = (e) => {
      if (e.target.classList.contains('nav')) {
        return;
      }
      this.hideOrShowSideNav('hide');
    };
  }

  render(element) {
    if (element) this.vieewElement = element.querySelector('#navbar');
    else this.vieewElement = DOMDoc.getElementById('navbar');

    this.childView.style.display = 'flex';
    const logoutElement = this.childView.querySelectorAll('.logged-out');
    const loginElement = this.childView.querySelectorAll('.logged-in');

    if (account.isAuthenticated()) {
      loginElement[0].style.display = 'flex';
      logoutElement[0].style.display = 'none';

      loginElement[1].style.display = 'block';
      logoutElement[1].style.display = 'none';
    } else {
      loginElement[0].style.display = 'none';
      logoutElement[0].style.display = 'flex';

      loginElement[1].style.display = 'none';
      logoutElement[1].style.display = 'block';
    }
    this.vieewElement.appendChild(this.childView);
  }

  /**
   * Hides or Shows Navigation bar
   * @param action {'hide' | 'show'}
   * @private
   */
  hideOrShowSideNav(action) {
    const sideNav = this.childView.querySelector('.side-nav');
    const nav = sideNav.querySelector('.nav');
    if (action === 'hide') {
      sideNav.style.width = '0';
      nav.style.width = '0';
    } else {
      sideNav.style.width = '100vw';
      nav.style.width = '250px';
    }
  }

  initialize() {
    this.render();
  }

  getViewElement() {
    return this.childView;
  }
}

const navBarView = new NavBarView();
navBarView.init();
export default navBarView;
