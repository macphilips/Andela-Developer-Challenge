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
  const { password, ...result } = data;
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
        status: 'Operation Successful',
      });
    }).catch((err) => {
      HttpError.sendError(err, res);
    });
  }

  static registerUser(req, res) {
    const { email, password } = req.body;
    const message = validateEmailAndPassword(req.body);
    if (message !== null) {
      HttpError.sendError(new HttpError(message, 400, 'Invalid Parameter(s)'), res);
    } else {
      const promise = db.connection.users.findOneByEmail(email);
      promise
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
          return Promise.reject(new HttpError(`Email [${email}] already in user`, 409, 'Registration Failed'));
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
        .then((result) => {
          const payload = {
            id: result.id,
          };
          const user = removePasswordField(result);
          res.set(AuthenticationMiddleware.AUTHORIZATION_HEADER, createToken(payload))
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
      if (!passwordIsValid) return Promise.reject(new HttpError('Old password does not match our record', 403, 'Password Mismatch'));
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      const result = { ...user };
      result.password = hashedPassword;
      return db.connection.users.save(result);
    })
      .then(user => res.status(200).send({
        status: 'Operation Successful',
        message: `Password updated for ${user.email}`,
      }))
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }
}
