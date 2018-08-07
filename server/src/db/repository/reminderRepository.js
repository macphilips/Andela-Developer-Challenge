import sql from '../sql';
import Reminder from '../../models/reminder';
import { mapAndWrapDbPromise } from '../../utils/util';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class ReminderRepository {
  constructor(db) {
    this.db = db;
  }

  findByUserId(id) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM reminder WHERE user_id = $1', +id),
      Reminder.mapDBReminderEntityToReminder);
  }

  save(input) {
    const reminder = { ...input };

    return this.findByUserId(reminder.userId)
      .then((data) => {
        if (data) {
          const update = { ...data, ...reminder };
          return mapAndWrapDbPromise(this.db.one(sql.reminder.update, { ...update }),
            Reminder.mapDBReminderEntityToReminder);
        }
        return mapAndWrapDbPromise(this.db.one(sql.reminder.add, { ...reminder }),
          Reminder.mapDBReminderEntityToReminder);
      });
  }
}
