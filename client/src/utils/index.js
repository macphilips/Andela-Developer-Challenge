// eslint-disable-next-line no-undef
const storage = localStorage;

export function storeToken(token) {
  storage.authenticationToken = token;
}

export function clearToken() {
  storage.clear();
}

export function getToken() {
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (storage.authenticationToken) {
      return storage.authenticationToken;
    }
  }
  return null;
}

export function printError(err) {
// eslint-disable-next-line no-console
  console.error(err);
}
