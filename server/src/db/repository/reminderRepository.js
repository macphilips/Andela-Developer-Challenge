import sql from '../sql';
import Reminder from '../../models/reminder';
import BaseRepository from './baseRepository';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class ReminderRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.reminder);
  }

  findByUserId(userId) {
    return super.findById({ userId }, Reminder.mapDBReminderEntityToReminder);
  }

  save(input) {
    return super.save(input, Reminder.mapDBReminderEntityToReminder);
  }
}
