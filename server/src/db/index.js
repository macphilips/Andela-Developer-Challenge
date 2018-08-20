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
import ReminderRepository from './repository/reminderRepository';
import GcmTokenRepository from './repository/gcmTokenRepository';
import sql from './sql';

class Database {
  get connection() {
    return this.dbConnection;
  }

  constructor() {
    const initOptions = {
      promiseLib: promise,
      extend(db) {
        const obj = db;
        obj.users = new UserRepository(obj);
        obj.entries = new EntriesRepository(obj);
        obj.reminder = new ReminderRepository(obj);
        obj.gcmToken = new GcmTokenRepository(obj);
      },
    };

    const pgp = pgPromise(initOptions);
    this.dbConnection = pgp(config.dbUrl);
  }

  init() {
    return this.connection.none(sql.myDiary)
      .then(() => this.connection.none(sql.functions));
  }
}

const db = new Database();
export default db;
