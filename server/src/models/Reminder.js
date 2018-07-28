export default class Reminder {
  constructor(time, from, to, userId) {
    this.time = time;
    this.userId = userId;
    this.daily = true;
    this.from = from;
    this.to = to;
  }

  static mapDBReminderEntityToReminder(entity) {
    const reminder = new Reminder();
    reminder.userId = entity.user_id;
    reminder.to = entity.user_id;
    reminder.from = entity.user_id;
    reminder.time = entity.md_time;
    return reminder;
  }
}
