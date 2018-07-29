export default class User {
  constructor(id, password, email, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    // this.authorities = [];
  }

  static mapDBUserEntityToUser(entity) {
    const mapped = User.map(entity);
    return Promise.resolve(mapped);
  }

  static mapDBUserArrayToUsers(array) {
    const users = [];
    array.forEach((item) => {
      users.push(User.map(item));
    });
    return Promise.resolve(users);
  }

  static map(entity) {
    if (!entity) return null;
    const user = new User();
    user.id = entity.id;
    user.password = entity.password_hash;
    user.firstName = entity.first_name;
    user.lastName = entity.last_name;
    user.email = entity.email;
    user.createdDate = entity.created_date;
    user.lastModified = entity.last_modified_date;
    return user;
  }
}
