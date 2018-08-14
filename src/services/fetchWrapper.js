import { getToken, storeToken } from '../utils/util';
import Event from '../utils/event';

class FetchWrapper {
  constructor() {
    this.event = new Event();
  }

  /**
   * Sends HTTP request
   *
   * @param method {'DELETE' | 'GET' | 'POST' |  'PUT'}
   * @param url {string}
   * @param [body] {object} [body=null]
   * @returns {Promise<T>}
   * @private
   */
  request(method, url, body) {
    const fetchData = {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const token = getToken();
    if (token) {
      fetchData.headers['X-Access-Token'] = token;
    }
    // eslint-disable-next-line no-undef
    return fetch(url, fetchData)
      .then((res) => {
        const { status } = res;
        if (status === 401) {
          this.event.notify({});
          return null;
        }
        if (status < 400 || status >= 600) {
          const accessToken = res.headers.get('X-Access-Token');
          if (accessToken) storeToken(accessToken);
          return Promise.resolve(res);
        }
        return Promise.resolve(res.json()).then(data => Promise.reject(new Error(data.message)));
      })
      .then(res => res.json());
  }

  get(url) {
    return this.request('GET', url);
  }

  post(url, data) {
    return this.request('POST', url, data);
  }

  put(url, data) {
    return this.request('PUT', url, data);
  }

  delete(url, data) {
    return this.request('DELETE', url, data);
  }
}

const http = new FetchWrapper();
export default http;
