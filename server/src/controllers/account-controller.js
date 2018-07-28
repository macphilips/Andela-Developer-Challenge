import bcrypt from 'bcryptjs';
import User from '../models/User';
import { isEmpty } from '../functions/util';
import db from '../db/index';

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
      res.status(500).send({ message: err.message });
    });
  }

  static registerUser(req, res) {
    const { email, password } = req.body;
    const promise = Promise.resolve(!(isEmpty(email) || isEmpty(password)));
    promise
      .then((validate) => {
        if (validate) {
          return db.connection.users.findOneByEmail(email);
        }
        return Promise.reject(Error('Email or password cannot be empty'));
      })
      .then((data) => {
        if (!data) {
          const hashedPassword = bcrypt.hashSync(req.body.password, 8);
          const newUser = new User();
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.email = email;
          newUser.login = email;
          newUser.password = hashedPassword;
          return db.connection.users.save(newUser);
        }
        return Promise.reject(Error(`Email [${email}] already in user`));
      })
      .then((data) => {
        res.status(201).send(removePasswordField(data));
      })
      .catch(err => res.status(400).send({ message: err.message }));
  }
}
