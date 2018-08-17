import { getToken, storeToken } from '../utils';
import Event from '../utils/event';

export default class FetchWrapper {
  constructor() {
    this.event = new Event();
  }

  /**
   * Sends HTTP request
   *
   * @param method {'DELETE' | 'GET' | 'POST' |  'PUT'}
   * @param url {string}
   * @param [body] {object}
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
    if (getToken()) {
      fetchData.headers['X-Access-Token'] = getToken();
    }
    // eslint-disable-next-line no-undef
    return fetch(url, fetchData)
      .then((res) => {
        const { status } = res;
        if (status === 401) {
          return this.event.notify({});
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

  get(url, data) {
    const esc = encodeURIComponent;
    let query = '';
    if (data) {
      const params = Object.keys(data)
        .map(k => `${esc(k)}=${esc(data[k])}`)
        .join('&');
      query = `?${params}`;
    }
    const urlQuery = `${url}${query}`;
    return this.request('GET', urlQuery);
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
