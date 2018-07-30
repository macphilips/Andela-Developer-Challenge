import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '../config/config';
import HttpError from '../errors/HttpError';

export function createToken(payload) {
  return jwt.sign(payload, config.secret, {
    expiresIn: config.validity,
  });
}

export function validateToken(token) {
  try {
    return Promise.resolve(jwt.verify(token, config.secret));
  } catch (err) {
    let message = 'Invalid Token';
    if (err instanceof TokenExpiredError) {
      message = 'Access Token has Expired.';
    }
    return Promise.reject(new HttpError(message, 401));
  }
}
