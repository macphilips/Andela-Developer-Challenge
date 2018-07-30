function loadEntries(callback) {
  setTimeout(function () {
    var xhttp = null;
    if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
    } else {
      // code for old IE browsers
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        callback(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", "asset/entries.json", true);
    xhttp.send();
  }, 0)
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function bindPropertiesToElement(dataModelElements, model) {
  var i;
  for (i = 0; i < dataModelElements.length; i++) {
    var element = dataModelElements[i];
    var data = element.getAttribute('tc-data-model');
    element.innerHTML = getValue(model, data);
  }
}

function requiresSubstitution(regEx, str) {
  return regEx.test(str);
}

function getSubstituteValue(context) {
  return function (regexMatch, placeholder) {
    return getValue(context, placeholder);
  };
}

function formatter(input, context) {
  var regEx = /{{([^{]*?)}}/g;
  if (requiresSubstitution(regEx, input)) {
    input = input.replace(regEx, getSubstituteValue(context));
  }
  return input;
}

function getValue(context, contextStr) {
  var splitArray = contextStr.split(".");
  var currentContext = context;
  while (splitArray.length) {
    var item = splitArray.shift().trim();
    if (typeof(currentContext) === "object" && item in currentContext)
      currentContext = currentContext[item];
    else
      return;
  }
  return currentContext;
}