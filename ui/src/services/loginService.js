import { clearToken, storeToken } from '../utils/util';

export default class LoginService {
  /**
   *
   * @param accountService {UserAccount}
   * @param http {FetchWrapper}
   * @param apiRequest {ApiRequestService}
   */
  constructor(accountService, http, apiRequest) {
    this.account = accountService;
    this.apiRequest = apiRequest;
    http.event.attach(() => {
      this.logout();
    });
  }

  logout() {
    clearToken();
    this.account.authenticate(null);
  }

  login(credentials) {
    return this.apiRequest.authenticateUser(credentials).then((res) => {
      storeToken(res.token);
      return this.account.identify(true);
    });
  }
}
