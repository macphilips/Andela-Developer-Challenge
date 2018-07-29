export default class Reminder {
  constructor(id, time, from, to, userId) {
    this.id = id;
    this.time = time;
    this.userId = userId;
    this.daily = true;
    this.from = from;
    this.to = to;
  }

  static mapDBReminderEntityToReminder(entity) {
    let reminder = null;
    if (entity) {
      reminder = new Reminder();
      reminder.id = entity.id;
      reminder.userId = entity.user_id;
      reminder.to = entity.to_date;
      reminder.from = entity.from_date;
      reminder.time = entity.md_time;
    }
    return Promise.resolve(reminder);
  }
}
