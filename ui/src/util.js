export function htmlToElement(html) {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
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
      return;
    }
  }
  return currentContext;
}

export function bindPropertiesToElement(dataModelElements, model) {
  let i;
  for (i = 0; i < dataModelElements.length; i += 1) {
    const element = dataModelElements[i];
    const data = element.getAttribute('tc-data-model');
    element.innerHTML = getValue(model, data);
  }
}

export function requiresSubstitution(regEx, str) {
  return regEx.test(str);
}

export function getSubstituteValue(context) {
  return function (regexMatch, placeholder) {
    return getValue(context, placeholder);
  };
}

export function formatter(input, context) {
  const regEx = /{{([^{]*?)}}/g;
  if (requiresSubstitution(regEx, input)) {
    input = input.replace(regEx, getSubstituteValue(context));
  }
  return input;
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
