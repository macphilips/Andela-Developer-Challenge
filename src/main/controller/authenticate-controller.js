import bcrypt from 'bcryptjs';
import TokenProvider from '../security/jwt-provider';
import userRepository from '../repository/users';

export default class AuthenticateController {
  static authenticate(req, res) {
    const err = {
      code: 401,
      auth: false,
      message: 'Authorization failed. Check if email or password is correct',
    };
    const user = userRepository.findOneByEmail(req.body.email);
    if (!user) return res.status(401).send(err);

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send(err);

    const payload = {
      id: user.id,
    };
    const token = TokenProvider.createToken(payload);
    return res.status(200).send({auth: true, token});
  }
}
