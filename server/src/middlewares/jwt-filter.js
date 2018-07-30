import jwt, { TokenExpiredError } from 'jsonwebtoken';
import Builder from '../functions/ant-matcher';
import HttpError from '../errors/HttpError';
import config from '../config/config';
import {validateToken} from "./jwt-provider";

class AuthenticationMiddleware {
  static get AUTHORIZATION_HEADER() {
    return 'x-access-token';
  }

  static doFilter(req, res, next) {
    const antPathMatcher = new Builder().create();
    const url = req.originalUrl;
    if (antPathMatcher.isMatch('/api/v1/auth/**', url)) {
      return next();
    }
    if (antPathMatcher.isMatch('/api/v1/**', url)) {
      return Promise.resolve(req.body.token || req.query.token
        || req.headers[AuthenticationMiddleware.AUTHORIZATION_HEADER])
        .then((token) => {
          if (!token) {
            return Promise.reject(new HttpError('No token provided.', 401));
          }
         return validateToken(token);
        }).then((decoded) => {
          req.userId = parseInt(decoded.id, 10);
          next();
        }).catch((err) => {
          HttpError.sendError(err, res);
          // next(err);
        });
    }
    return next();
  }
}

export default AuthenticationMiddleware;
