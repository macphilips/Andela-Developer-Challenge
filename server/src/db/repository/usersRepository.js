import sql from '../sql';
import User from '../../models/user';
import { mapAndWrapDbPromise } from '../../utils';
import BaseRepository from './baseRepository';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class UserRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.users);
  }

  findById(id) {
    return super.findById({ id }, User.mapDBUserEntityToUser);
  }

  getUserDetailsWithEntryCountById(id) {
    const promise = this.db.oneOrNone(this.sql.findUserWithEntriesCount, { id })
      .then(result => ((result === null)
        ? this.db.oneOrNone(this.sql.findUser, { id }) : Promise.resolve(result)));
    return mapAndWrapDbPromise(promise,
      User.mapDBUserEntityToUserDetail);
  }

  save(input) {
    return super.save(input, User.mapDBUserEntityToUser);
  }

  findOneByEmail(email) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM md_user WHERE email = $1', email),
      User.mapDBUserEntityToUser);
  }

  findAll() {
    return mapAndWrapDbPromise(this.db.any('SELECT * FROM md_user'),
      User.mapDBUserArrayToUsers);
  }
}
