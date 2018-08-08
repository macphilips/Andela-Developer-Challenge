import { mapArray } from '../utils';
import Reminder from './reminder';

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
    return mapArray(array, User.map);
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
    if (entity.md_time) user.reminder = Reminder.map(entity);
    if (entity.num_entries) user.entry = { count: parseInt(entity.num_entries, 10) };

    return user;
  }
}
