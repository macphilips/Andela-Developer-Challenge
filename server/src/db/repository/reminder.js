import sql from '../sql';
import Reminder from '../../models/Reminder';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class ReminderRepository {
  constructor(db) {
    this.db = db;
  }

  // findById(id) {
  //   return this.db.oneOrNone('SELECT * FROM reminder WHERE id = $1', +id)
  //     .then(Reminder.mapDBReminderEntityToReminder);
  // }

  findByUserId(id) {
    return this.db.oneOrNone('SELECT * FROM reminder WHERE user_id = $1', +id)
      .then(Reminder.mapDBReminderEntityToReminder);
  }

  save(input) {
    const reminder = { ...input };
    // reminder.from = input.from || '';
    // reminder.to = input.to || '';
    return this.findByUserId(reminder.userId)
      .then((data) => {
        if (data) {
          const update = { ...data, ...reminder };
          return this.db.one(sql.reminder.update, { ...update })
            .then(Reminder.mapDBReminderEntityToReminder);
        }
        return this.db.one(sql.reminder.add, { ...reminder })
          .then(Reminder.mapDBReminderEntityToReminder);
      });
  }
}
