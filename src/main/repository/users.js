import has from 'has';
import randomString from 'randomstring';


const debug = require('debug')('api:server');

class UserRepository {
  constructor() {
    this._users = {};
  }

  findById(userId) {
    return (has(this._users, userId)) ? this._users[userId] : false;
  }

  save(input) {
    const user = { ...input };
    if (!user.id) {
      user.id = randomString.generate(8);
      user.createdDate = new Date();
    }
    const oldValue = this._users[user.id];
    this._users[user.id] = { ...oldValue, ...user };
    return this._users[user.id];
  }

  findOneByEmail(email) {
    const users = [];
    Object.keys(this._users).forEach(((key, index, array) => {
      debug(`key ${key} index ${index} array of ${array}`);
      const user = this._users[key];
      if (user.email === email) {
        users.push(user);
      }
    }));
    if (users.length === 1) {
      return users[0];
    }
    if (users.length === 0) {
      return null;
    }
    throw new Error(`Don't know how we got here users => ${users.length}`);
  }

  findAll() {
    const users = [];
    Object.keys(this._users).forEach(((value, index, array) => {
      debug(`key ${value} index ${index} array of ${array}`);
      users.push(this._users[value]);
    }));
    return users;
  }

  clear() {
    this._users = {};
  }
}

const user = new UserRepository();
export default user;
