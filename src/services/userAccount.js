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
  identify(force) {
    if (force === true) {
      this.account = undefined;
      this.authenticated = false;
    }
    if (this.account) {
      return Promise.resolve(this.account);
    }
    return this.apiRequest.getUserDetails()
      .then((res) => {
        this.account = res;
        this.authenticated = this.account !== null;
        return Promise.resolve(this.account);
      });
  }

  isAuthenticated() {
    return this.authenticated;
  }
}
