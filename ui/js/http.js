function request(method, url, body) {
  console.log(`fetch from => ${url} body => `, body);
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
      if (status < 400 || status >= 600) {
        return Promise.resolve(res);
      }
      return Promise.reject(new Error(res.body.message));
    })
    .then(res => res.json())
    .catch((err) => {
      console.log('error => ', err);
    });

  // return new Promise(((resolve, reject) => {
  //   const req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  //   req.open(method, url);
  //   req.setRequestHeader('Content-Type', 'application/json');
  //   if (localStorage.authenticationToken) {
  //     req.setRequestHeader('X-Access-Token', localStorage.authenticationToken);
  //   }
  //   req.onload = () => {
  //     const { status } = req;
  //     if (status < 400 || status >= 600) {
  //       resolve(JSON.parse(req.response));
  //     } else {
  //       const err = (req.getResponseHeader('content-type').match('application/json')) ? JSON.parse(req.response) : req.statusText;
  //       reject((err));
  //     }
  //   };
  //   req.onerror = () => {
  //     reject(Error('Network Error'));
  //   };
  //   req.send(JSON.stringify(body));
  // }));
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

