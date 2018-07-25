/* eslint-disable */
function NavBarView() {
  this._viewElement = document.getElementById('navbar');
  this._viewElement.style.display = 'none';
  this._viewElement.classList.add('nav-container');
  this._viewElement.appendChild(htmlToElement(navbarHeaderTemplate));
  const logout = this._viewElement.querySelector('#logout');
  logout.onclick = () => {
    localStorage.clear('authenticationToken');
    window.location.replace('signin.html');
  }
}

NavBarView.prototype = {
  render() {
    this._viewElement.style.display = 'flex';
  }
};