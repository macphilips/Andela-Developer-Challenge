import { DOMDoc, gotoUrl, htmlToElement } from '../utils/index';
import { navbarHeaderTemplate } from '../utils/templates';

export default class NavBarViewService {
  logoutHandle() {
    return () => {
      this.loginService.logout();
      gotoUrl('#/');
    };
  }

  /**
   *
   * @param account {UserAccount}
   * @param loginService {LoginService}
   */
  constructor(account, loginService) {
    this.viewElement = null;
    this.childView = htmlToElement(navbarHeaderTemplate);
    this.account = account;
    this.loginService = loginService;
  }

  init() {
    const logout = this.childView.querySelectorAll('.logout-js');
    const handle = this.logoutHandle();
    logout[0].onclick = handle;
    logout[1].onclick = handle;

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
    if (element) this.viewElement = element.querySelector('#navbar');
    else this.viewElement = DOMDoc.getElementById('navbar');

    if (!this.viewElement) return;

    this.childView.style.display = 'flex';
    const logoutElement = this.childView.querySelectorAll('.logged-out');
    const loginElement = this.childView.querySelectorAll('.logged-in');
    if (this.account.isAuthenticated()) {
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
    this.viewElement.innerHTML = '';
    this.viewElement.appendChild(this.childView);
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
