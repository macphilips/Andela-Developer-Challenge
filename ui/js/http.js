function request(method, url, body) {
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
        const token = res.headers.get('X-Access-Token');
        if (token) localStorage.authenticationToken = token;
        return Promise.resolve(res);
      }
      return Promise.resolve(res.json()).then(data => Promise.reject(new Error(data.message)));
    })
    .then(res => res.json());
  // .catch((err) => {
  //   console.log('error => ', err);
  // });
}

function get(url) {
  return request('GET', url);
}

function post(url, data) {
  return request('POST', url, data);
}

function put(url, data) {
  return request('PUT', url, data);
}

function deleteRequest(url, data) {
  return request('DELETE', url, data);
}
