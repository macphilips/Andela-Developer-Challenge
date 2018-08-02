import { htmlToElement } from './util';
import { navbarHeaderTemplate } from './templates';

export default class NavBarView {
  constructor() {
    this.vieewElement = document.getElementById('navbar');
    this.vieewElement.style.display = 'none';
    this.vieewElement.classList.add('nav-container');
    this.vieewElement.appendChild(htmlToElement(navbarHeaderTemplate));
    const logout = this.vieewElement.querySelector('#logout');
    logout.onclick = () => {
      localStorage.clear('authenticationToken');
      window.location.replace('/');
    };
  }

  render() {
    this.vieewElement.style.display = 'flex';
    const logoutElement = this.vieewElement.querySelector('.logged-out');
    const loginElement = this.vieewElement.querySelector('.logged-in');

    if (localStorage.authenticationToken) {
      loginElement.style.display = 'flex';
      logoutElement.style.display = 'none';
    } else {
      loginElement.style.display = 'none';
      logoutElement.style.display = 'flex';
    }
  }
}
