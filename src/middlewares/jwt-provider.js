import jwt from 'jsonwebtoken';
import config from '../config/config';

function createToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.validity,
  });
}

function validateToken(token) {
  // jwt.verify(token, config.secret, callback);
  try {
    return jwt.verify(token, config.secret);
  } catch (err) {
    throw err;
  }
}

module.exports = { createToken, validateToken };
