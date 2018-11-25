class UserValidator {
  validateName = (firstName, lastName) => {
    const regExp = /^[a-zA-Z\-\s]{2,16}$/;

    if (!regExp.test(firstName)) {
      return 'First name not valid: It must contain at least 2 character and it must not exceed 16 characters';
    }
    if (!regExp.test(lastName)) {
      return 'Last name not valid: It must contain at least 2 character and it must not exceed 16 characters';
    }
  };

  validatePassword = (password, matchPassword) => {
    let message;
    const trimmedPassword = password.trim();
    if (!trimmedPassword.length) {
      message = 'Password cannot be empty';
    }
    if (trimmedPassword.length < 8) {
      message = 'Password must be at least 8 characters';
    }
    if (trimmedPassword !== matchPassword) {
      message = 'Password do not match';
    }
    return message;
  };

  validateEmail = (email) => {
    const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regExp.test(email)) {
      return 'Email not valid';
    }
  };
}

const userValidator = new UserValidator();

export default userValidator;
