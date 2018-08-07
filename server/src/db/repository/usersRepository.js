import sql from '../sql';
import User from '../../models/user';
import HttpError from '../../utils/httpError';
import { mapAndWrapDbPromise } from '../../utils/util';

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
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM md_user WHERE id = $1', +id),
      User.mapDBUserEntityToUser);
  }

  getAllUserDetailsById(id) {
    return mapAndWrapDbPromise(this.db.oneOrNone(sql.users.findUser, { id }),
      User.mapDBUserEntityToUser);
  }

  save(input) {
    const user = { ...input };
    const now = new Date();
    if (!input.id) {
      user.createdDate = now;
      user.lastModified = now;
      return mapAndWrapDbPromise(this.db.one(sql.users.add, { ...user }),
        User.mapDBUserEntityToUser);
    }

    user.lastModified = now;
    return this.findById(user.id).then((data) => {
      const updated = { ...data, ...user };
      return mapAndWrapDbPromise(this.db.one(sql.users.update, { ...updated }),
        User.mapDBUserEntityToUser);
    });
  }

  findOneByEmail(email) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM md_user WHERE email = $1', email),
      User.mapDBUserEntityToUser);
  }

  findAll() {
    return mapAndWrapDbPromise(this.db.any('SELECT * FROM md_user'),
      User.mapDBUserArrayToUsers);
  }

  clear() {
    return this.db.none(sql.users.empty)
      .catch(HttpError.wrapAndThrowError);
  }
}
