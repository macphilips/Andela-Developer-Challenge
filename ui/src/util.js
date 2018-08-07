export function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function getValue(context, contextStr) {
  const splitArray = contextStr.split('.');
  let currentContext = context;
  while (splitArray.length) {
    const item = splitArray.shift().trim();
    if (typeof (currentContext) === 'object' && item in currentContext) {
      currentContext = currentContext[item];
    } else {
      return null;
    }
  }
  return currentContext;
}

export function bindPropertiesToElement(dataModelElements, model) {
  if (!model) return;
  const handler = (target) => {
    const element = target;
    const data = element.getAttribute('tc-data-model');
    const value = getValue(model, data);
    if (element.nodeName === 'INPUT') {
      element.value = value || '';
    } else {
      element.innerHTML = value;
    }
  };

  for (let i = 0; i < dataModelElements.length; i += 1) {
    handler(dataModelElements[i]);
  }
}

export function requiresSubstitution(regEx, str) {
  return regEx.test(str);
}

export function getSubstituteValue(context) {
  return (regexMatch, placeholder) => getValue(context, placeholder);
}

export function formatter(input, context) {
  const regEx = /{{([^{]*?)}}/g;
  let result = input;
  if (requiresSubstitution(regEx, input)) {
    result = input.replace(regEx, getSubstituteValue(context));
  }
  return result;
}

let timer = null;

export function stopAlertTime() {
  clearTimeout(timer);
}

export function showAlert(msg, type) {
  stopAlertTime();
  const alert = document.getElementById('alert');
  if (!alert) return;
  alert.className = '';
  alert.classList.add('alert');
  alert.classList.add(type);
  const msgElement = alert.querySelector('.alert-msg');
  const closeElement = alert.querySelector('.close-btn');
  const closeHandler = () => {
    alert.style.display = 'none';
  };
  msgElement.innerHTML = msg;
  alert.style.display = 'block';

  closeElement.onclick = closeHandler;
  timer = setTimeout(closeHandler, 8000);
}

export function getFieldsAsObject(form) {
  const data = {};
  form.querySelectorAll('input').forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    data[name] = inputElement.value;
  });
  form.querySelectorAll('select').forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    data[name] = inputElement.options[inputElement.selectedIndex].value;
  });
  return data;
}

let toastTimer = null;

function stopToastTimer() {
  clearTimeout(toastTimer);
}

export function showToast(msg, type) {
  stopToastTimer();
  const alert = document.getElementById('toast');
  if (!alert) return;
  alert.className = '';
  alert.classList.add('toast');
  const msgElement = alert.querySelector('.alert-msg');
  const closeElement = alert.querySelector('.close-btn');
  const closeHandler = () => {
    alert.classList.remove('show');
    alert.classList.add('dismiss');
  };
  msgElement.innerHTML = msg;
  alert.classList.add('show');
  alert.classList.remove('dismiss');
  alert.classList.add(type);

  closeElement.onclick = closeHandler;
  toastTimer = setTimeout(closeHandler, 8000);
}
