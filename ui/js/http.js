function request(method, url, body) {
  return new Promise(((resolve, reject) => {
    const req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    req.open(method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    if (localStorage.authenticationToken) {
      req.setRequestHeader('X-Access-Token', localStorage.authenticationToken);
    }
    req.onload = () => {
      const { status } = req;
      if (status < 400 || status >= 600) {
        resolve(JSON.parse(req.response));
      } else {
        const err = (req.getResponseHeader('content-type').match('application/json')) ? JSON.parse(req.response) : req.statusText;
        reject((err));
      }
    };
    req.onerror = () => {
      reject(Error('Network Error'));
    };
    req.send(JSON.stringify(body));
  }));
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
