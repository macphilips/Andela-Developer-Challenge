import { clearToken, storeToken } from '../utils';

export default class LoginService {
  /**
   *
   * @param accountService {UserAccount}
   * @param http {FetchWrapper}
   * @param apiRequest {ApiRequestService}
   * @param notificationService {NotificationSettings}
   */
  constructor(accountService, http, apiRequest, notificationService) {
    this.notificationService = notificationService;
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
      this.notificationService.getToken();
      return this.account.identify(true);
    });
  }
}
