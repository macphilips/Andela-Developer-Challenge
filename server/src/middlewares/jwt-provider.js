import jwt from 'jsonwebtoken';
import config from '../config/config';

export function createToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.validity,
  });
}

export function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}
