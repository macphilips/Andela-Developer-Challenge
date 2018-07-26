import sql from '../sql';
import User from '../../models/User';

export default class UserRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE id = $1', +id)
      .then(User.mapDBUserEntityToUser);
  }

  save(input) {
    const user = {...input};
    user.createdDate = new Date();
    user.lastModified = new Date();
    return this.db.one(sql.users.add, {...user})
      .then(User.mapDBUserEntityToUser);
  }

  findOneByEmail(email) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE email = $1', email)
      .then(User.mapDBUserEntityToUser);
  }

  findOneByLogin(login) {
    return this.db.oneOrNone('SELECT * FROM md_user WHERE login = $1', login)
      .then(User.mapDBUserEntityToUser);
  }

  findAll() {
    return this.db.any('SELECT * FROM md_user');
  }

  remove(id) {
    return this.db.result('DELETE FROM md_user WHERE id = $1', +id, r => r.rowCount);
  }

  clear() {
    return this.db.none(sql.users.empty);
  }

  create() {
    return this.db.none(sql.users.create);
  }
}
