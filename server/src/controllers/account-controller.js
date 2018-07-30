import bcrypt from 'bcryptjs';
import User from '../models/User';
import { validateEmailAndPassword } from '../functions/util';
import db from '../db/index';
import HttpError from '../errors/HttpError';
import Reminder from '../models/Reminder';
import { createToken } from '../middlewares/jwt-provider';
import AuthenticationMiddleware from '../middlewares/jwt-filter';

function removePasswordField(data) {
  const { password, ...result } = data;
  return result;
}

export default class AccountController {
  static getCurrentLoggedInUser(req, res) {
    const user = db.connection.users.findById(req.userId);
    user.then((result) => {
      res.status(200).send(removePasswordField(result));
    }).catch((err) => {
      HttpError.sendError(err, res);
    });
  }

  static registerUser(req, res) {
    const { email, password } = req.body;
    const promise = Promise.resolve(validateEmailAndPassword(req.body));
    promise
      .then((message) => {
        if (message == null) {
          return db.connection.users.findOneByEmail(email);
        }
        return Promise.reject(new HttpError(message, 400));
      })
      .then((data) => {
        if (!data) {
          const hashedPassword = bcrypt.hashSync(password, 8);
          const newUser = new User();
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.email = email;
          newUser.login = email;
          newUser.password = hashedPassword;
          return db.connection.users.save(newUser);
        }
        return Promise.reject(new HttpError(`Email [${email}] already in user`, 403));
      })
      .then((user) => {
        const reminder = new Reminder();
        reminder.userId = user.id;
        reminder.daily = true;
        reminder.from = 'SUNDAY';
        reminder.to = 'SATURDAY';
        reminder.time = '09:00';
        return db.connection.reminder.save(reminder);
      })
      .then(reminder => db.connection.users.findById(reminder.userId))
      .then((data) => {
        const payload = {
          id: data.id,
        };
        res.set(AuthenticationMiddleware.AUTHORIZATION_HEADER, createToken(payload))
          .status(201).send(removePasswordField(data));
      })
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }

  static changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    db.connection.users.findById(req.userId).then((user) => {
      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
      if (!passwordIsValid) return Promise.reject(new HttpError('Old password does not match our record', 403));
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      const result = { ...user };
      result.password = hashedPassword;
      return db.connection.users.save(result);
    })
      .then(user => res.status(200).send({ message: `Password updated for ${user.email}` }))
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }
}
