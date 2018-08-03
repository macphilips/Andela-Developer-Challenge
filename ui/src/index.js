import NavBarView from './navbarView';

document.addEventListener('DOMContentLoaded', () => {
  const navbar = new NavBarView();
  navbar.render();
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (localStorage.authenticationToken) {
      window.location.replace('dashboard.html');
    }
  } else {
    // Sorry! No Web Storage support..
  }
});
