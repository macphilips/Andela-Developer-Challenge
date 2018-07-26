export default class User {
  constructor(id, login, password, email, firstName, lastName) {
    this.id = id;
    this.login = login;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.authorities = [];
  }

  static mapDBUserEntityToUser(entity) {
    if (!entity) return null;
    const user = new User();
    user.id = entity.id;
    user.login = entity.login;
    user.password = entity.password_hash;
    user.firstName = entity.first_name;
    user.lastName = entity.last_name;
    user.email = entity.email;
    user.createdDate = entity.created_date;
    user.lastModified = entity.last_modified_date;
    return user;
  }
}
