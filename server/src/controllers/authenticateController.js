import bcrypt from 'bcryptjs';
import { createToken } from '../middlewares/jwtProvider';
import db from '../db/index';
import { validateLoginInfo } from '../utils/util';

export default class AuthenticateController {
  static authenticate(req, res) {
    const message = validateLoginInfo(req.body);
    if (message !== null) {
      res.status(400).send({ message, status: 'Failed' });
    } else {
      const err = {
        status: 'Authorization failed',
        message: 'Check if email or password is correct',
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
        res.status(200).send({ token, message: 'Successfully authenticated user', status: 'Successful' });
      }).catch(() => res.status(401).send(err));
    }
  }
}
