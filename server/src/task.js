import admin from 'firebase-admin/lib/index';
import schedule from 'node-schedule';
import db from './db';
import config from './config/config';

const daysMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
export default class ScheduleTask {
  constructor() {
    const decoded = Buffer.from(config.accountServiceKey, 'base64').toString();
    const credentials = JSON.parse(decoded);
    this.config = {
      credential: admin.credential.cert(credentials),
      databaseURL: 'https://alc-mydiary.firebaseio.com',
    };

    this.options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
  }

  static sendNotification(registrationToken, payload, options) {
    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then()
      .catch(() => {
      });
  }

  init() {
    admin.initializeApp(this.config);
    schedule.scheduleJob('*/15 * * * *', () => {
      this.doJob();
    });
  }

  doJob() {
    const now = new Date();
    db.connection.reminder.findAllWithinLast15Minutes(now).then((reminders) => {
      const payload = {
        notification: {
          title: 'MyDiary Reminder',
          body: 'Time to pen down your thought',
        },
      };
      if (reminders && reminders instanceof Array) {
        reminders.forEach((reminder) => {
          let { from, to } = reminder;
          from = daysMap[from.toLowerCase()];
          to = daysMap[to.toLowerCase()];
          if (ScheduleTask.withinDays(from, to, now.getDay())) {
            ScheduleTask.sendNotification(reminder.gcm.token, payload, this.options);
          }
        });
      }
    }).catch(() => {
    });
  }

  static normalizeDay(value, lowerBound) {
    let result = value;
    if (result < lowerBound) {
      result = 6 + result + 1;
    }
    return result;
  }

  static withinDays(from, to, day) {
    const lowerBound = from;
    const upperBound = ScheduleTask.normalizeDay(to, lowerBound);
    const test = ScheduleTask.normalizeDay(day, lowerBound);
    return test >= lowerBound && test <= upperBound;
  }
}
