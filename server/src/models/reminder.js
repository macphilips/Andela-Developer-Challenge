import { mapArray } from '../utils';

export default class Reminder {
  constructor(id, time, from, to, userId) {
    this.id = id;
    this.time = time;
    this.userId = userId;
    this.enabled = false;
    this.from = from;
    this.to = to;
  }

  static mapDBReminderEntityToReminder(entity) {
    return Promise.resolve(Reminder.map(entity));
  }

  static map(entity) {
    let reminder = null;
    if (entity) {
      reminder = new Reminder();
      reminder.id = entity.id;
      reminder.userId = entity.user_id;
      reminder.to = entity.to_date;
      reminder.from = entity.from_date;
      reminder.time = entity.md_time;
      reminder.enabled = entity.enabled;
      if (entity.token) reminder.gcm = { token: entity.token };
    }

    return reminder;
  }

  static mapDBUserArrayToReminder(array) {
    if (array instanceof Array) {
      return mapArray(array, Reminder.map);
    }
    throw new Error();
  }
}
