class FetchWrapper {
  request(method, url, body) {
    const fetchData = {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (localStorage.authenticationToken) {
      fetchData.headers['X-Access-Token'] = localStorage.authenticationToken;
    }
    return fetch(url, fetchData)
      .then((res) => {
        const {status} = res;

        if (status === 401) {
          localStorage.clear();
          location.replace('sign.html');
        }
        if (status < 400 || status >= 600) {
          const token = res.headers.get('X-Access-Token');
          if (token) localStorage.authenticationToken = token;
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
}

const http = new FetchWrapper();
export default http;
