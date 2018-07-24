import has from 'has';
import randomString from 'randomstring';

class UserRepository {
  constructor() {
    this.users = {};
  }

  findById(userId) {
    return (has(this.users, userId)) ? this.users[userId] : false;
  }

  save(input) {
    const user = { ...input };
    if (!user.id) {
      user.id = randomString.generate(8);
      user.createdDate = new Date();
    }
    const oldValue = this.users[user.id];
    this.users[user.id] = { ...oldValue, ...user };
    return this.users[user.id];
  }

  findOneByEmail(email) {
    const users = [];
    Object.keys(this.users).forEach(((key, index, array) => {
      const user = this.users[key];
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
    Object.keys(this.users).forEach(((value, index, array) => {
      users.push(this.users[value]);
    }));
    return users;
  }

  clear() {
    this.users = {};
  }
}

const user = new UserRepository();
export default user;
