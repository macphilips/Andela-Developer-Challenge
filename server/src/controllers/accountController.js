import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  getTimeString, isEmpty, validateEmailAndPassword, validateNameAndEmail,
} from '../utils';
import db from '../db';
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
        status: 'Successful',
      });
    }).catch((err) => {
      HttpError.sendError(err, res);
    });
  }

  static getCurrentLoggedInUserFullDetails(req, res) {
    const user = db.connection.users.getUserDetailsWithEntryCountById(req.userId);
    user.then((result) => {
      const data = result;
      data.user = removePasswordField(data.user);
      res.status(200).send({
        data,
        message: 'Successfully retrieved all user information',
        status: 'Successful',
      });
    }).catch((err) => {
      HttpError.sendError(err, res);
    });
  }

  static updateUser(req, res) {
    const { userId } = req;
    const { email } = req.body;
    const message = validateNameAndEmail(req.body);
    Promise.resolve(message)
      .then(() => {
        if (message !== null) {
          return Promise.reject(new HttpError(message, 400, 'Failed'));
        }
        return db.connection.users.findOneByEmail(email);
      })
      .then((data) => {
        if (data && data.id !== userId) {
          return Promise.reject(new HttpError('Email already exist', 409, 'Failed'));
        }
        const { password, ...user } = req.body;
        user.id = userId;
        return db.connection.users.save({ ...user });
      })
      .then((result) => {
        const user = removePasswordField(result);
        res.status(200).send({ user, status: 'successful', message: 'Updated User Account successfully' });
      })
      .catch((err) => {
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
        .then(data => ((!data) ? AccountController.saveUser(req.body)
          : Promise.reject(new HttpError('Email already exist', 409, 'Failed'))))
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

  static registerToken(req, res) {
    const { gcmToken } = req.body;
    const { userId } = req;
    Promise.resolve(!isEmpty(gcmToken))
      .then((result) => {
        if (result) {
          return db.connection.gcmToken.findByUserId(userId);
        }
        return Promise.reject(new HttpError('Invalid token', 401));
      })
      .then((result) => {
        const data = { gcmToken, userId };
        if (result) data.id = result.id;
        return db.connection.gcmToken.save(data);
      })
      .then(result => res.status(200).send({
        gcmToken: result,
        status: 'successful',
        message: 'Firebase token updated',
      }))
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }

  static removeToken(req, res) {
    const { userId } = req;
    db.connection.gcmToken.findByUserId(userId)
      .then((result) => {
        if (result) {
          return db.connection.gcmToken.remove(result.id);
        }
        return Promise.resolve(true);
      })
      .then(() => {
        res.status(200).send({ status: 'successful', message: 'Successfully removed Firebase Token' });
      })
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
    reminder.time = '09:00:00';
    return reminder;
  }
}
