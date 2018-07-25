function padValue(value) {
  let result = Number(value);
  if (result >= 0 && result < 10) {
    result = `0${result}`;
  }
  return result;
}

function timeInputController() {
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const handler = (e) => {
    const element = e.target;
    const unit = element.getAttribute('data-unit');
    let { value } = element;
    if (unit && unit === 'hours') {
      if (value < 0) {
        value = 0;
      } else if (value > 23) {
        value = 23;
      }
    } else if (unit && unit === 'minutes') {
      if (value < 0) {
        value = 0;
      } else if (value > 59) {
        value = 59;
      }
    }
    element.value = parseInt(value);
  };

  hoursInput.onkeyup = handler;
  hoursInput.onchange = handler;
  hoursInput.onpaste = handler;
  hoursInput.oncut = handler;

  minutesInput.onkeyup = handler;
  minutesInput.onchange = handler;
  minutesInput.onpaste = handler;
  minutesInput.oncut = handler;
  const focusHandler = (e) => {
    const element = e.target;
    minutesInput.classList.remove('hasFocus');
    hoursInput.classList.remove('hasFocus');
    element.classList.add('hasFocus');
  };
  const blurHandler = (e) => {
    const element = e.target;
    // element.classList.remove('hasFocus');
    const { value } = element;
    element.value = padValue(value);
  };

  hoursInput.onblur = blurHandler;
  minutesInput.onblur = blurHandler;
  hoursInput.onfocus = focusHandler;
  minutesInput.onfocus = focusHandler;
  const controlHandler = (e) => {
    const element = e.target;
    const direction = element.getAttribute('data-direction');
    // const hoursValue = hoursInput.value;
    // const minutesValue = minutesInput.value;
    let focused = document.querySelector('.hasFocus');
    if (!focused) {
      minutesInput.focus();
      focused = minutesInput;
    }
    const value = Number(focused.value);
    const minuteStep = 15;
    if (focused.id === 'minutes') {
      let result = 0;
      if (direction && direction === 'up') {
        result = (value % minuteStep === 0)
          ? value + minuteStep : minuteStep * (parseInt(value / minuteStep) + 1);
      } else if (direction && direction === 'down') {
        result = (value % minuteStep === 0)
          ? value - minuteStep : minuteStep * (parseInt(value / minuteStep) - 1);
      }
      let hourValue = Number(hoursInput.value);
      if (result < 0) {
        focused.value = 59;
        hourValue -= 1;
        hoursInput.value = (hourValue < 0)
          ? 23 : ((hourValue > 23) ? '00' : padValue(hourValue));
      } else if (result > 59) {
        focused.value = '00';
        hourValue += 1;
        hoursInput.value = (hourValue < 0)
          ? 23 : ((hourValue > 23) ? '00' : padValue(hourValue));
      } else {
        focused.value = padValue(result);
      }
    } else if (focused.id === 'hours') {
      let hourValue = Number(focused.value);
      if (direction && direction === 'down') {
        hourValue -= 1;
        focused.value = (hourValue < 0)
          ? 23 : ((hourValue > 23) ? '00' : padValue(hourValue));
      } else if (direction && direction === 'up') {
        hourValue += 1;
        focused.value = (hourValue < 0)
          ? 23 : ((hourValue > 23) ? '00' : padValue(hourValue));
      }
    }
  };

  const controlButtons = document.querySelectorAll('.time-controller-btn');
  for (let i = 0; i < controlButtons.length; i += 1) {
    controlButtons[i].onclick = controlHandler;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const navbar = new NavBarView();
  if (typeof (Storage) !== 'undefined') {
    // Code for localStorage/sessionStorage.
    if (localStorage.authenticationToken) {
      navbar.render();
      timeInputController();
    } else {
      window.location.replace('signin.html');
    }
  } else {
    // Sorry! No Web Storage support..
  }
});
