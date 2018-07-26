import pgPromise from 'pg-promise';
import config from '../config/config';

class Database {
  get connection() {
    return this.db_connection;
  }

  constructor() {
    const pgp = pgPromise();
    this.db_connection = pgp(config.dbUrl);
  }
}

const db = new Database();
export default db;
