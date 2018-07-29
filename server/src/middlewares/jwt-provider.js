import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../config/config';
import HttpError from '../errors/HttpError';

export function createToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.validity,
  });
}

export function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        let message = 'Invalid Token';
        if (err instanceof TokenExpiredError) {
          message = 'Access Token has Expired.';
        }
        reject(new HttpError(message, 401));
      }
      resolve(decoded);
    });
  });
}
