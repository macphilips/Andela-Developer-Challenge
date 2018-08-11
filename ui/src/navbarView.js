import { htmlToElement } from './util';
import { navbarHeaderTemplate } from './templates';

export default class NavBarView {
  static logoutHandle() {
    localStorage.clear('authenticationToken');
    window.location.replace('index.html');
  }

  constructor() {
    this.vieewElement = document.getElementById('navbar');
    this.vieewElement.style.display = 'none';
    this.vieewElement.appendChild(htmlToElement(navbarHeaderTemplate));
    const logout = this.vieewElement.querySelectorAll('.logout-js');

    logout[0].onclick = NavBarView.logoutHandle;
    logout[1].onclick = NavBarView.logoutHandle;

    const dismissSideNavButton = this.vieewElement.querySelector('[tc-data-dismiss="side-nav"]');
    dismissSideNavButton.onclick = () => {
      this.hideOrShowSideNav('hide');
    };
    const showSideNavButton = this.vieewElement.querySelector('.navicon');
    showSideNavButton.onclick = () => {
      this.hideOrShowSideNav('show');
    };

    const sideNav = this.vieewElement.querySelector('.side-nav');
    sideNav.onclick = (e) => {
      if (e.target.classList.contains('nav')) {
        return;
      }
      this.hideOrShowSideNav('hide');
    };
  }

  render() {
    this.vieewElement.style.display = 'flex';
    const logoutElement = this.vieewElement.querySelectorAll('.logged-out');
    const loginElement = this.vieewElement.querySelectorAll('.logged-in');

    if (localStorage.authenticationToken) {
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
  }

  hideOrShowSideNav(action) {
    const sideNav = this.vieewElement.querySelector('.side-nav');
    const nav = sideNav.querySelector('.nav');
    if (action === 'hide') {
      sideNav.style.width = '0';
      nav.style.width = '0';
    } else {
      sideNav.style.width = '100vw';
      nav.style.width = '250px';
    }
  }
}
