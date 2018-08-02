import sql from '../sql';
import User from '../../models/user';
import HttpError from '../../utils/httpError';
import Entry from '../../models/entry';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class UserRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE id = $1', +id)
      .then(result => User.mapDBUserEntityToUser(result))
      .catch(HttpError.wrapAndThrowError);
  }

  getAllUserDetailsById(id) {
    return this.db.oneOrNone(sql.users.findUser, { id })
      .then(result => User.mapDBUserEntityToUser(result))
      .catch(HttpError.wrapAndThrowError);
  }

  save(input) {
    const user = { ...input };
    const now = new Date();
    if (!input.id) {
      user.createdDate = now;
      user.lastModified = now;
      return this.db.one(sql.users.add, { ...user })
        .then(result => (User.mapDBUserEntityToUser(result)))
        .catch(HttpError.wrapAndThrowError);
    }

    user.lastModified = now;
    return this.findById(user.id).then((data) => {
      const updated = { ...data, ...user };
      return this.db.one(sql.users.update, { ...updated })
        .then(result => (Entry.mapDBEntriesEntityToEntries(result)))
        .catch(HttpError.wrapAndThrowError);
    });
  }

  findOneByEmail(email) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE email = $1', email)
      .then(result => (User.mapDBUserEntityToUser(result)))
      .catch(HttpError.wrapAndThrowError);
  }

  findAll() {
    return this.db.any('SELECT * FROM md_user')
      .then(result => (User.mapDBUserArrayToUsers(result)))
      .catch(HttpError.wrapAndThrowError);
  }

  clear() {
    return this.db.none(sql.users.empty)
      .catch(HttpError.wrapAndThrowError);
  }
}
