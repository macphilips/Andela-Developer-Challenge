/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */

import pgPromise from 'pg-promise';
import promise from 'bluebird';
import config from '../config/config';
import UserRepository from './repository/usersRepository';
import EntriesRepository from './repository/entriesRepository';
import sql from './sql';
import ReminderRepository from './repository/reminderRepository';

class Database {
  get connection() {
    return this.dbConnection;
  }

  constructor() {
    const initOptions = {
      promiseLib: promise,
      extend(obj) {
        obj.users = new UserRepository(obj);
        obj.entries = new EntriesRepository(obj);
        obj.reminder = new ReminderRepository(obj);
      },
    };

    const pgp = pgPromise(initOptions);
    this.dbConnection = pgp(config.dbUrl);
  }

  init() {
    return this.connection.none(sql.myDiary);
  }
}

const db = new Database();
// db.init();
export default db;
