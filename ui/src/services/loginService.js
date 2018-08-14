import http from './fetchWrapper';
import account from './account';
import { clearToken, storeToken } from '../utils/util';
import { authenticationEndpoint } from '../utils/endpointUrl';

class LoginService {
  constructor(accountService) {
    this.account = accountService;
    http.event.attach(() => {
      this.logout();
    });
  }

  logout() {
    clearToken();
    this.account.authenticate(null);
  }

  login(credentials) {
    return http.post(authenticationEndpoint, credentials).then((res) => {
      storeToken(res.token);
      return this.account.identify(true);
    });
  }
}

const loginService = new LoginService(account);
export default loginService;
