import bcrypt from 'bcryptjs';
import User from '../model/User';
import { isEmpty } from '../util/util';
import userRepository from '../repository/users';

export default class AccountController {
  static getCurrentLoggedInUser(req, res) {
    const user = userRepository.findById(req.userId);
    const { password, ...result } = user;
    return res.status(200).send(result);
  }

  static registerUser(req, res) {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).send({ code: 400, message: 'Email or password cannot be empty' });
    }

    let user = userRepository.findOneByEmail(email.toLowerCase());
    if (user) return res.status(400).send({ code: 400, message: `Email [${email}] already in user` });
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user = new User();
    user.name = req.body.name;
    user.email = email;
    user.password = hashedPassword;
    user = userRepository.save(user);
    return res.status(201).send({ id: user.id, email: user.email, name: user.name });
  }
}
