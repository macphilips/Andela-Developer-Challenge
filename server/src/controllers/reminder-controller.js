import validator from 'validator';
import db from '../db';
import HttpError from '../errors/HttpError';
import { padValue } from '../functions/util';

export default class ReminderController {
  static updateReminder(req, res) {
    const { from, to, time } = req.body;
    const { userId } = req;
    // regex was gotten https://stackoverflow.com/a/20123018
    Promise.resolve(validator.matches(time, /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/i))
      .then((valid) => {
        if (valid) {
          return db.connection.reminder.save({
            from, to, userId, time: padValue(time),
          });
        }
        return Promise.reject(new HttpError('Invalid Time input: format HH:MM', 400));
      })
      .then((result) => {
        res.status(200).send((result));
      })
      .catch(err => HttpError.sendError(err, res));
  }

  static getReminder(req, res) {
    // const { id } = req.params;
    const { userId } = req;
    db.connection.reminder.findByUserId(userId).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(new HttpError('Can\'t find settings for this user', 404));
    }).then((result) => {
      res.status(200).send(result);
    }).catch(err => HttpError.sendError(err, res));
  }
}
