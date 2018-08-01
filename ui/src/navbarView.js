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
      window.location.replace('signin.html');
    };
  }

  render() {
    this.vieewElement.style.display = 'flex';
  }
}
