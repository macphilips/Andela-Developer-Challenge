export default class User {
  constructor(id, name, username, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.authorities = [];
  }
}
