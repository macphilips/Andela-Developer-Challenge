import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../model/User';
import userRepository from '../../repository/users';
import Util from '../../util/util';
import VerifyToken from '../../security/jwt-filter';

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (Util.isEmpty(email) || Util.isEmpty(password)) {
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
});

router.get('/me', VerifyToken, (req, res) => {
  const user = userRepository.findById(req.userId);
  const { password, ...result } = user;
  res.status(200).send(result);
});

module.exports = router;
