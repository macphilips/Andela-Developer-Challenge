import db from '../db';

export default class ReminderController {
  static createReminder(req, res) {
    const { from, to, time } = req.body;
    const { userId } = req;
    db.connection.reminder.save({
      from,
      to,
      time,
      userId,
    }).then(result => res.status(201).send((result)))
      .catch(err => res.status(400).send({ message: err.message }));
  }

  static getReminder(req, res) {
    // const { id } = req.params;
    const { userId } = req;
    db.connection.reminder.findByUserId(userId).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(new Error());
    }).then((result) => {
      res.status(200).send(result);
    }).catch(() => res.status(404).send({ message: 'Reminder not found' }));
  }
}
