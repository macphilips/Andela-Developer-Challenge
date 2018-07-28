import bcrypt from 'bcryptjs';
import { createToken } from '../middlewares/jwt-provider';
import db from '../db/index';

export default class AuthenticateController {
  static authenticate(req, res) {
    const err = {
      auth: false,
      message: 'Authorization failed. Check if email or password is correct',
    };
    const userPromise = db.connection.users.findOneByEmail(req.body.email);
    userPromise.then((data) => {
      if (data) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
        if (!passwordIsValid) return Promise.reject(Error());

        const payload = {
          id: data.id,
        };
        return Promise.resolve(createToken(payload));
      }
      return Promise.reject(Error());
    }).then((token) => {
      res.status(200).send({ auth: true, token });
    }).catch(() => res.status(401).send(err));
  }
}
