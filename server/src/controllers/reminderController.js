import db from '../db';
import HttpError from '../utils/httpError';
import { padValue, validateTime } from '../utils';

export default class ReminderController {
  static updateReminder(req, res) {
    const { userId } = req;
    Promise.resolve(validateTime(req.body))
      .then((message) => {
        if (message === null) {
          return db.connection.reminder.findByUserId(userId);
        }
        return Promise.reject(new HttpError(message, 400, 'Failed'));
      })
      .then(result => ReminderController.saveReminder(req, result))
      .then((result) => {
        res.status(200).send({
          reminder: result,
          message: 'Successfully updated reminder settings',
          status: 'Successful',
        });
      })
      .catch((error) => {
        HttpError.sendError(error, res);
      });
  }

  static saveReminder(req, result) {
    const { userId } = req;
    const { from, to, time } = req.body;
    const reminder = {
      from, to, userId, time: padValue(time),
    };
    if (result) reminder.id = result.id;
    return db.connection.reminder.save(reminder);
  }

  static getReminder(req, res) {
    // const { id } = req.params;
    const { userId } = req;
    db.connection.reminder.findByUserId(userId).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(new HttpError('Can\'t find settings for this user', 404, 'Failed'));
    }).then((result) => {
      res.status(200).send({
        reminder: result,
        message: 'Successfully retrieved reminder settings',
        status: 'Successful',
      });
    }).catch(err => HttpError.sendError(err, res));
  }
}
