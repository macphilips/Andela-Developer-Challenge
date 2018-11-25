import { clearToken, storeToken } from '../utils/index';

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
  }

  logout() {
    clearToken();
    this.account.authenticate(null);
  }

  async login(credentials) {
    try {
      const res = await this.apiRequest.authenticateUser(credentials);
      storeToken(res.token);
      const [result] = await Promise.all([
        this.account.identify(true),
        this.notificationService.getToken()]);
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
