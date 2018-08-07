import bcrypt from 'bcryptjs';
import User from '../models/user';
import { getTimeString, validateEmailAndPassword } from '../utils/util';
import db from '../db/index';
import HttpError from '../utils/httpError';
import Reminder from '../models/reminder';
import { createToken } from '../middlewares/jwtProvider';
import AuthenticationMiddleware from '../middlewares/jwtFilter';

function removePasswordField(data) {
  if (!data) return null;
  const { password, reminder, ...result } = data;
  result.createdDate = getTimeString(result.createdDate);
  result.lastModified = getTimeString(result.lastModified);
  return result;
}

export default class AccountController {
  static getCurrentLoggedInUser(req, res) {
    const user = db.connection.users.findById(req.userId);
    user.then((result) => {
      res.status(200).send({
        user: removePasswordField(result),
        message: 'Successfully retrieved all user information',
        status: 'Successful',
      });
    }).catch((err) => {
      HttpError.sendError(err, res);
    });
  }

  static registerUser(req, res) {
    const { email } = req.body;
    const message = validateEmailAndPassword(req.body);

    if (message !== null) {
      HttpError.sendError(new HttpError(message, 400, 'Failed'), res);
    } else {
      db.connection.users.findOneByEmail(email)
        .then(data => ((!data) ? AccountController.saveUser(req.body) : Promise.reject(new HttpError('Email already exist', 409, 'Failed'))))
        .then(user => db.connection.reminder
          .save(AccountController.getDefaultReminderSettings(user)))
        .then(reminder => db.connection.users.findById(reminder.userId))
        .then((result) => {
          const { id } = result;
          const user = removePasswordField(result);
          res.set(AuthenticationMiddleware.AUTHORIZATION_HEADER, createToken({ id }))
            .status(201).send({ user, status: 'successful', message: 'Created User Account successfully' });
        })
        .catch((err) => {
          HttpError.sendError(err, res);
        });
    }
  }

  static changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    db.connection.users.findById(req.userId).then((user) => {
      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
      if (!passwordIsValid) return Promise.reject(new HttpError('Incorrect password', 403, 'Failed'));
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      const result = { ...user };
      result.password = hashedPassword;
      return db.connection.users.save(result);
    })
      .then(() => res.status(200).send({
        status: 'Successful',
        message: 'Password updated',
      }))
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }


  static saveUser(body) {
    const newUser = new User();
    newUser.firstName = body.firstName;
    newUser.lastName = body.lastName;
    newUser.email = body.email;
    newUser.password = bcrypt.hashSync(body.password, 8);
    return db.connection.users.save(newUser);
  }

  static getDefaultReminderSettings(user) {
    const reminder = new Reminder();
    reminder.userId = user.id;
    reminder.daily = true;
    reminder.from = 'SUNDAY';
    reminder.to = 'SATURDAY';
    reminder.time = '09:00';
    return reminder;
  }
}
