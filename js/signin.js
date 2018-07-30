let timer = null;

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

function stopAlertTime() {
  clearTimeout(timer);
}

function showAlert(msg, type) {
  stopAlertTime();
  const alert = document.getElementById('alert');
  if (!alert) return;
  alert.className = '';
  alert.classList.add('alert');
  alert.classList.add(type);
  const msgElement = alert.querySelector('.alert-msg');
  const closeElement = alert.querySelector('.close-btn');
  const closeHandler = function () {
    alert.style.display = 'none';
  };
  msgElement.innerHTML = msg;
  alert.style.display = 'block';

  closeElement.onclick = closeHandler;
  timer = setTimeout(closeHandler, 8000);
}

function createAccount(e) {
  e.preventDefault();
  const form = document.getElementById('signupForm');
  if (validateForm(form) && matchPassword(form)) {

  }
}

function signIn(e) {
  if (e) e.preventDefault();
  const form = document.getElementById('signinForm');
  if (validateForm(form)) {
    const formJson = toJSONString(form);
    // todo get authentication token from server
    localStorage.authenticationToken = formJson;
    window.location.replace('index.html');
  }
}

function send(url, formData) {

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
