function validateForm(form) {
  let valid = true;
  const inputForms = form.querySelectorAll('input');
  for (let i = inputForms.length - 1; i >= 0; i--) {
    const inputForm = inputForms[i];
    let value = inputForm.value;
    if (inputForm.type !== 'password') value = value.trim();
    if (value === '') {
      inputForm.className += ' invalid';
      valid = false;
      showAlert('Input Field(s) cannot be empty', 'error');
      inputForm.focus();
      inputForm.oninput = function (e) {
        e.target.classList.remove('invalid');
      };
    }
  }
  return valid;
}

function matchPassword(form) {
  let valid = true;
  const matchPasswordElement = form.querySelector('#match-password');
  if (matchPasswordElement) {
    const passwordElement = form.querySelector('#password');
    if (matchPasswordElement.value !== passwordElement.value) {
      showAlert('Please input a matching password', 'error');
      valid = false;
    }
  }
  return valid;
}

function getFields(form) {
  const data = {};
  form.querySelectorAll('input').forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    data[name] = inputElement.value;
  });
  console.log(JSON.stringify(data));
  return data;
}

function createAccount(e) {
  e.preventDefault();
  const form = document.getElementById('signupForm');
  if (validateForm(form) && matchPassword(form)) {
    const data = getFields(form);
    post(registrationEndpoint, data).then((res) => {
      console.log(res);
      showAlert('Successful', 'success');
    }, (err) => {
      console.log(err);
      showAlert('Registration Failed', 'error');
    });
  }
}

function signIn(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('signinForm');
  if (validateForm(form)) {
    const formJson = toJSONString(form);
    const data = getFields(form);
    post(authenticationEndpoint, data).then((res) => {
      console.log(res);
      localStorage.authenticationToken = res.token;
      window.location.replace('index.html');
    }, (err) => {
      console.log(err);
      showAlert('Authentication Failed, check email or password', 'error');
    });
  }
}

function send(url, formData) {
  post(url, formData);
}

function toJSONString(form) {
  const obj = {};
  const elements = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const name = element.name;
    let value = element.value;
    if (element.type === 'checkbox') {
      value = element.checked;
    }

    if (name) {
      obj[name] = value;
    }
  }
  return JSON.stringify(obj);
}

document.addEventListener('DOMContentLoaded', (event) => {
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.onsubmit = signIn;
  }
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.onsubmit = createAccount;
  }
});
