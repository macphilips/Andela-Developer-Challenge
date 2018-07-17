import express from 'express';
import bcrypt from 'bcryptjs';
import userRepository from '../../repository/users';
import TokenProvider from '../../security/jwt-provider';

const router = express.Router();

router.post('/', (req, res) => {
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

  return res.status(200).send({ auth: true, token });
});

module.exports = router;
