/* eslint-disable no-param-reassign */
/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */

import pgPromise from 'pg-promise';
import promise from 'bluebird';
import config from '../config/config';
import UserRepository from './repository/users';
import EntriesRepository from './repository/entries';
import sql from './sql';

class Database {
  get connection() {
    return this.db_connection;
  }

  constructor() {
    const initOptions = {
      promiseLib: promise,
      extend(obj) {
        obj.users = new UserRepository(obj);
        obj.entries = new EntriesRepository(obj);
      },
    };

    const pgp = pgPromise(initOptions);
    this.db_connection = pgp(config.dbUrl);
  }

  init() {
    this.connection.none(sql.myDiary);
  }
}

const db = new Database();
db.init();
export default db;
