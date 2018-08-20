import admin from 'firebase-admin/lib/index';
import schedule from 'node-schedule';
import db from './db';
import config from './config/config';

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
      .catch(() => {});
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
        for (let i = 0; i < reminders.length; i += 1) {
          ScheduleTask.sendNotification(reminders[i].gcm.token, payload, this.options);
        }
      }
    }).catch(() => {});
  }
}
