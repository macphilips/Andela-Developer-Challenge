import db from '../db';
import HttpError from '../utils/httpError';
import { padValue, validateTime } from '../utils/util';

export default class ReminderController {
  static updateReminder(req, res) {
    const { from, to, time } = req.body;
    const { userId } = req;
    Promise.resolve(validateTime(req.body))
      .then((message) => {
        if (message === null) {
          return db.connection.reminder.save({
            from, to, userId, time: padValue(time),
          });
        }
        return Promise.reject(new HttpError(message, 400, 'Validation Failed'));
      })
      .then((result) => {
        res.status(200).send({
          reminder: result,
          message: 'Successfully updated reminder settings',
          status: 'Operation Successful',
        });
      })
      .catch((error) => {
        HttpError.sendError(error, res);
      });
  }

  static getReminder(req, res) {
    // const { id } = req.params;
    const { userId } = req;
    db.connection.reminder.findByUserId(userId).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(new HttpError('Can\'t find settings for this user', 404, 'Operation Failed'));
    }).then((result) => {
      res.status(200).send({
        reminder: result,
        message: 'Successfully retrieved reminder settings',
        status: 'Operation Successful',
      });
    }).catch(err => HttpError.sendError(err, res));
  }
}
