import jwt from 'jsonwebtoken';
import config from '../config';

function createToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.validity,
  });
}

function validateToken(token, callback) {
  jwt.verify(token, config.secret, callback);
}

module.exports = { createToken, validateToken };
