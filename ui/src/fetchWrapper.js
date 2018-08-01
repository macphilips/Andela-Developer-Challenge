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
        const { status } = res;
        if (status < 400 || status >= 600) {
          return Promise.resolve(res);
        }
        return Promise.reject(new Error(res.body.message));
      })
      .then(res => res.json())
      .catch((err) => {
        console.log('error => ', err);
      });
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
