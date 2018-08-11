import sql from '../sql';
import Reminder from '../../models/reminder';
import BaseRepository from './baseRepository';
import { mapAndWrapDbPromise } from '../../utils';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class ReminderRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.reminder);
  }

  findById(id) {
    return super.findById({ id }, Reminder.mapDBReminderEntityToReminder);
  }

  findByUserId(userId) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM reminder WHERE user_id = $1', userId),
      Reminder.mapDBReminderEntityToReminder);
  }

  save(input) {
    return super.save(input, Reminder.mapDBReminderEntityToReminder);
  }
}
