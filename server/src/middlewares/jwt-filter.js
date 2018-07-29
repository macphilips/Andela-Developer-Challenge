import { validateToken } from './jwt-provider';
import Builder from '../functions/ant-matcher';
import HttpError from '../errors/HttpError';

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
      Promise.resolve(req.body.token || req.query.token
        || req.headers[AuthenticationMiddleware.AUTHORIZATION_HEADER])
        .then((token) => {
          let promise = null;
          if (!token) {
            promise = Promise.reject(new HttpError('No token provided.', 401));
          } else {
            // verifies secret and checks exp
            try {
              promise = validateToken(token);
            } catch (err) {
              console.log('error occured while validating token');
              console.log(err);
              promise = Promise.reject(new HttpError('Invalid Token', 401));
            }
          }
          return promise;
        }).then((decoded) => {
          req.userId = parseInt(decoded.id, 10);
          next();
        }).catch((err) => {
          HttpError.sendError(err, res);
        });
      return null;
    }
    return next();
  }
}

export default AuthenticationMiddleware;
