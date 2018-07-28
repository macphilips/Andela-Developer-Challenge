import sql from '../sql';
import User from '../../models/User';
import Entry from '../../models/Entry';
import { wrapAndThrowError } from '../../errors/HttpError';

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
      .then(result => Promise.resolve(User.mapDBUserEntityToUser(result)))
      .catch(wrapAndThrowError);
  }

  save(input) {
    const user = { ...input };
    user.createdDate = new Date();
    user.lastModified = new Date();
    return this.db.one(sql.users.add, { ...user })
      .then(result => Promise.resolve(User.mapDBUserEntityToUser(result)))
      .catch(wrapAndThrowError);
  }

  findOneByEmail(email) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE email = $1', email)
      .then(result => Promise.resolve(User.mapDBUserEntityToUser(result)))
      .catch(wrapAndThrowError);
  }

  findAll() {
    return this.db.any('SELECT * FROM md_user')
      .then(result => Promise.resolve(User.mapDBUserArrayToUsers(result)))
      .catch(wrapAndThrowError);
  }

  remove(id) {
    return this.db.result('DELETE FROM md_user WHERE id = $1', +id, r => r.rowCount)
      .catch(wrapAndThrowError);
  }

  clear() {
    return this.db.none(sql.users.empty)
      .catch(wrapAndThrowError);
  }
}
