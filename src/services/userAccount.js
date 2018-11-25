export default class UserAccount {
  /**
   *
   * @param apiRequest {ApiRequestService}
   */
  constructor(apiRequest) {
    this.apiRequest = apiRequest;
    this.account = null;
    this.authenticated = false;
  }

  authenticate(userAccount) {
    this.account = userAccount;
    this.authenticated = userAccount !== null;
  }

  /**
   *
   * @param [force]
   * @returns {Promise<any>}
   */
  async identify(force) {
    if (force === true) {
      this.account = undefined;
      this.authenticated = false;
    }
    if (this.account) {
      return Promise.resolve(this.account);
    }
    try {
      this.account = await this.apiRequest.getUserDetails();
      this.authenticated = this.account !== null;
      return Promise.resolve(this.account);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  isAuthenticated() {
    return this.authenticated;
  }
}
